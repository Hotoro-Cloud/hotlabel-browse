import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Types for HotLabel SDK
interface HotLabelSDK {
  init: (config: HotLabelConfig) => HotLabelSDK;
  state: {
    initialized: boolean;
    completedTasks: number;
    earnings: number;
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
  [key: string]: any;
}

// Add HotLabel to Window interface
declare global {
  interface Window {
    HotLabel?: HotLabelSDK;
  }
}

interface HotLabelToggleProps {
  className?: string;
  onChange?: (enabled: boolean) => void;
}

const HotLabelToggle: React.FC<HotLabelToggleProps> = ({ className, onChange }) => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [publisherEarnings, setPublisherEarnings] = useState(0);
  const [userExperience, setUserExperience] = useState(7.5);
  const [adsBlocked, setAdsBlocked] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const statsInterval = useRef<number | null>(null);
  const statsStarted = useRef(false);
  
  // Hardcoded API endpoint - change this to match your server location
  const API_ENDPOINT = "http://localhost:8000";

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (statsInterval.current) {
        window.clearInterval(statsInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isEnabled) {
      setIsLoading(true);
      enableHotLabel().finally(() => setIsLoading(false));
    } else {
      disableHotLabel();
    }
    
    // Notify parent component of change
    if (onChange) {
      onChange(isEnabled);
    }
  }, [isEnabled, onChange]);
  
  // Listen for task completed events to update metrics
  useEffect(() => {
    const handleTaskCompleted = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Task completed event captured in HotLabelToggle:", customEvent.detail);
      
      // Update metrics on any task completion
      updateMetricsOnTaskCompletion();
    };
    
    // Add event listener
    document.addEventListener('hotlabel-task-completed', handleTaskCompleted);
    
    // Clean up
    return () => {
      document.removeEventListener('hotlabel-task-completed', handleTaskCompleted);
    };
  }, []);

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
      
      // Start metrics updates
      startMetricsUpdates();
      
      toast({
        title: "HotLabel Enabled",
        description: "You'll now see a single AI task instead of multiple popup ads",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to enable HotLabel:", error);
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
    
    // Stop metrics updates
    stopMetricsUpdates();
    
    if (tasksCompleted > 0) {
      toast({
        title: "HotLabel Disabled",
        description: `Thanks for helping! You completed ${tasksCompleted} tasks.`,
      });
    }
  };

  const loadHotLabelScript = () => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/js/hotlabel-sdk.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load HotLabel SDK"));
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
        window.HotLabel.init({
          publisherId: "demo-publisher",
          adSlotSelector: ".hotlabel-container",
          apiEndpoint: API_ENDPOINT,
          debug: true,
          adReplacementRate: 1.0,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          customTaskRenderer: true
        });
        
        // Verify initialization
        if (!window.HotLabel.state.initialized) {
          reject(new Error("HotLabel initialization failed"));
          return;
        }
        
        // Test health check to ensure server connection
        fetch(`${API_ENDPOINT}/health`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log("Server health check:", data);
            resolve();
          })
          .catch(error => {
            console.warn("Server health check failed:", error);
            // Continue anyway with local mode
            resolve();
          });
      } catch (error) {
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
  
  const updateMetricsOnTaskCompletion = () => {
    setTasksCompleted(prev => prev + 1);
    setPublisherEarnings(prev => {
      const increment = 0.04; // $0.04 per label
      return parseFloat((prev + increment).toFixed(2));
    });
    setAdsBlocked(prev => prev + 3); // Each task replaces approximately 3 ads
    setUserExperience(prev => {
      const newValue = Math.min(prev + 0.1, 10.0);
      return parseFloat(newValue.toFixed(1));
    });
  };
  
  const startMetricsUpdates = () => {
    // Only start if not already started
    if (statsStarted.current) return;
    
    statsStarted.current = true;
    
    // Reset metrics if switching from traditional to HotLabel
    if (!isEnabled) {
      setTasksCompleted(0);
      setPublisherEarnings(0);
      setUserExperience(7.5);
      setAdsBlocked(0);
    }
    
    // We don't need to simulate metrics anymore since we're getting real task completions
    // We'll just check HotLabel state periodically to keep metrics in sync
    statsInterval.current = window.setInterval(() => {
      if (window.HotLabel && window.HotLabel.state) {
        // Sync completedTasks from SDK state if it's greater than our current count
        const sdkTaskCount = window.HotLabel.state.completedTasks || 0;
        if (sdkTaskCount > tasksCompleted) {
          setTasksCompleted(sdkTaskCount);
          
          // Update related metrics
          setPublisherEarnings(parseFloat((sdkTaskCount * 0.04).toFixed(2)));
          setAdsBlocked(sdkTaskCount * 3);
          
          // Update user experience score (cap at 10)
          const newScore = Math.min(7.5 + (sdkTaskCount * 0.1), 10.0);
          setUserExperience(parseFloat(newScore.toFixed(1)));
        }
      }
    }, 2000);
  };

  const stopMetricsUpdates = () => {
    if (statsInterval.current) {
      window.clearInterval(statsInterval.current);
      statsInterval.current = null;
      statsStarted.current = false;
    }
  };

  return (
    <div className={cn(
      "fixed top-20 right-5 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden",
      className
    )}>
      <div className="bg-primary text-white p-3 font-semibold">
        Experience Control
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2">
            <Switch 
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              id="hotlabel-toggle"
              disabled={isLoading}
            />
            <Label htmlFor="hotlabel-toggle" className="text-sm">
              {isLoading ? "Loading..." : "Use HotLabel"}
            </Label>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Currently showing: <span className="font-medium">{isEnabled ? "HotLabel Tasks" : "Traditional Ads"}</span>
        </div>
        
        {isEnabled && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Completed</div>
                <div className="font-semibold">{tasksCompleted}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Publisher Earnings</div>
                <div className="font-semibold">${publisherEarnings.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">User Experience Score</div>
                <div className="font-semibold">{userExperience}/10</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Ads Blocked</div>
                <div className="font-semibold text-green-500">{adsBlocked}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotLabelToggle;