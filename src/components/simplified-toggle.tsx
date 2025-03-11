import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Types for HotLabel SDK
interface HotLabelSDK {
  init: (config: HotLabelConfig) => HotLabelSDK;
  state: {
    initialized: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface HotLabelConfig {
  publisherId: string;
  adSlotSelector: string;
  apiEndpoint: string;
  debug?: boolean;
  adReplacementRate?: number;
  theme?: "light" | "dark";
  customTaskRenderer?: boolean;
}

// Add HotLabel to Window interface
declare global {
  interface Window {
    HotLabel?: HotLabelSDK;
  }
}

interface SimplifiedHotLabelToggleProps {
  onChange?: (enabled: boolean) => void;
}

const SimplifiedToggle: React.FC<SimplifiedHotLabelToggleProps> = ({ onChange }) => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [healthCheckPerformed, setHealthCheckPerformed] = useState(false);
  
  // API endpoint for the server
  const API_ENDPOINT = "http://localhost:8000";

  useEffect(() => {
    // Use a reference to track if this effect is already running
    let isEnabling = false;
    
    if (isEnabled && !isEnabling) {
      isEnabling = true;
      setIsLoading(true);
      console.log("Starting HotLabel enablement");
      
      enableHotLabel()
        .then(() => {
          console.log("HotLabel enabled successfully");
          setIsLoading(false);
          isEnabling = false;
        })
        .catch(error => {
          console.error("Failed to enable HotLabel:", error);
          setIsLoading(false);
          setIsEnabled(false);
          isEnabling = false;
        });
    } else if (!isEnabled) {
      console.log("Disabling HotLabel");
      disableHotLabel();
    }
    
    // Notify parent component of change
    if (onChange) {
      onChange(isEnabled);
    }
    
    // Cleanup function to handle component unmount
    return () => {
      if (isEnabled) {
        console.log("Component unmounting, disabling HotLabel");
        disableHotLabel();
      }
    };
  }, [isEnabled]);

  const enableHotLabel = async () => {
    // Hide traditional ads
    hideTraditionalAds();
    
    try {
      // Load and initialize HotLabel SDK if not already loaded
      if (window.HotLabel) {
        await initializeHotLabel();
      } else {
        await loadHotLabelScript();
        await initializeHotLabel();
      }
      
      toast({
        title: "HotLabel Enabled",
        description: "You'll now see a single AI task instead of multiple popup ads",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "HotLabel Error",
        description: "Failed to initialize HotLabel. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const disableHotLabel = () => {
    // Show traditional ads
    showTraditionalAds();
    
    // Remove HotLabel tasks
    removeHotLabelTasks();
  };

  const loadHotLabelScript = () => {
    return new Promise<void>((resolve, reject) => {
      // If HotLabel is already loaded, just resolve
      if (window.HotLabel) {
        console.log("HotLabel SDK already loaded, skipping script load");
        resolve();
        return;
      }
      
      // Check if script is already being loaded
      if (document.querySelector('script[src="/js/hotlabel-sdk.js"]')) {
        console.log("HotLabel SDK script is already loading");
        
        // Wait for it to load
        const checkForHotLabel = () => {
          if (window.HotLabel) {
            console.log("HotLabel SDK loaded by another process");
            resolve();
          } else {
            setTimeout(checkForHotLabel, 100);
          }
        };
        
        checkForHotLabel();
        return;
      }
      
      // Otherwise load the script
      console.log("Loading HotLabel SDK script");
      const script = document.createElement("script");
      script.src = "/js/hotlabel-sdk.js";
      script.onload = () => {
        console.log("HotLabel SDK script loaded successfully");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load HotLabel SDK script");
        reject(new Error("Failed to load HotLabel SDK"));
      };
      document.head.appendChild(script);
    });
  };

  const initializeHotLabel = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!window.HotLabel) {
        reject(new Error("HotLabel SDK not available"));
        return;
      }
      
      try {
        // Check if already initialized
        if (window.HotLabel.state && window.HotLabel.state.initialized) {
          console.log("HotLabel already initialized, skipping re-init");
          resolve();
          return;
        }
        
        // Initialize the SDK
        window.HotLabel.init({
          publisherId: "demo-publisher",
          adSlotSelector: ".hotlabel-container",
          apiEndpoint: API_ENDPOINT,
          debug: false, // Set to false to reduce console noise
          adReplacementRate: 1.0,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          customTaskRenderer: true
        });
        
        // Health check only on first initialization
        if (!healthCheckPerformed) {
          setHealthCheckPerformed(true);
          
          // Use regular promises instead of await
          fetch(`${API_ENDPOINT}/health`)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error(`Health check failed with status: ${response.status}`);
            })
            .then(() => {
              console.log("Health check completed successfully");
            })
            .catch(error => {
              console.warn("Server health check failed:", error);
            })
            .finally(() => {
              // Always resolve the promise, even if health check fails
              resolve();
            });
        } else {
          resolve();
        }
      } catch (error) {
        console.error("Error initializing HotLabel:", error);
        reject(error);
      }
    });
  };

  const hideTraditionalAds = () => {
    const popupAdElements = document.querySelectorAll(".popup-ad");
    popupAdElements.forEach(popup => {
      if (popup instanceof HTMLElement) {
        popup.dataset.originalDisplay = popup.style.display;
        popup.style.display = "none";
      }
    });
  };

  const showTraditionalAds = () => {
    const popupAdElements = document.querySelectorAll(".popup-ad");
    popupAdElements.forEach(popup => {
      if (popup instanceof HTMLElement && popup.dataset.originalDisplay) {
        popup.style.display = popup.dataset.originalDisplay;
      }
    });
  };

  const removeHotLabelTasks = () => {
    const hotlabelTasks = document.querySelectorAll(".hotlabel-container .hotlabel-task");
    hotlabelTasks.forEach(task => {
      task.remove();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={isEnabled}
        onCheckedChange={setIsEnabled}
        id="hotlabel-toggle"
        disabled={isLoading}
      />
      <Label htmlFor="hotlabel-toggle" className="text-sm text-foreground">
        {isLoading ? "Loading..." : "Use HotLabel"}
      </Label>
    </div>
  );
};

export default SimplifiedToggle;