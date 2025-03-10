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
  const metricsInterval = useRef<number | null>(null);
  const metricsStarted = useRef(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (metricsInterval.current) {
        window.clearInterval(metricsInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isEnabled) {
      enableHotLabel();
    } else {
      disableHotLabel();
    }
    
    // Notify parent component of change
    if (onChange) {
      onChange(isEnabled);
    }
  }, [isEnabled, onChange]);

  const enableHotLabel = () => {
    // Hide traditional ads
    hideTraditionalAds();
    
    // Load and initialize HotLabel SDK if not already loaded
    if (window.HotLabel) {
      initializeHotLabel();
    } else {
      loadHotLabelScript(() => initializeHotLabel());
    }
    
    // Start metrics updates
    startMetricsUpdates();
    
    toast({
      title: "HotLabel Enabled",
      description: "You'll now see a single AI task instead of multiple popup ads",
    });
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

  const loadHotLabelScript = (callback: () => void) => {
    const script = document.createElement("script");
    script.src = "/js/hotlabel-sdk.js";
    script.onload = callback;
    document.head.appendChild(script);
  };

  const initializeHotLabel = () => {
    if (window.HotLabel) {
      window.HotLabel.init({
        publisherId: "demo-publisher",
        adSlotSelector: ".hotlabel-container",
        debug: true,
        adReplacementRate: 1.0,
        theme: "light",
        customTaskRenderer: true
      });
      
      // Set up a custom event listener for task completion
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        
        // Check if the clicked element is a hotlabel option button
        if (target.classList.contains('hotlabel-option')) {
          // Get the parent container
          const taskElement = target.closest('.hotlabel-task');
          if (taskElement) {
            const taskId = taskElement?.getAttribute('data-task-id') || `task-${Date.now()}`;
            
            // Get the container that has the data-ad-id
            const container = taskElement.closest('.hotlabel-container') || document.querySelector('.hotlabel-container');
            const adId = container?.getAttribute('data-ad-id') || `ad-${Date.now()}`;
            
            console.log("HotLabel task selected:", { taskId, adId });
            
            // Send a custom event that task was completed
            setTimeout(() => {
              const customEvent = new CustomEvent('hotlabel-task-completed', {
                detail: { adId, taskId }
              });
              document.dispatchEvent(customEvent);
              
              console.log("Dispatched task completion event:", { adId, taskId });
              
              // Update metrics
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
            }, 2000); // Delay to show completion message
          }
        }
      });
      
      // Also listen for task completed events from the download modal
      document.addEventListener('hotlabel-task-completed', (e: Event) => {
        const event = e as CustomEvent;
        console.log("Task completed event captured in HotLabelToggle:", event.detail);
        
        // Update metrics on any task completion
        setTasksCompleted(prev => prev + 1);
        setPublisherEarnings(prev => {
          const increment = 0.04; // $0.04 per label
          return parseFloat((prev + increment).toFixed(2));
        });
        setAdsBlocked(prev => prev + 3);
        setUserExperience(prev => {
          const newValue = Math.min(prev + 0.1, 10.0);
          return parseFloat(newValue.toFixed(1));
        });
      });
    }
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
    const hotlabelTasks = document.querySelectorAll(".hotlabel-container");
    hotlabelTasks.forEach(task => {
      task.remove();
    });
  };
  
  const startMetricsUpdates = () => {
    // Only start if not already started
    if (metricsStarted.current) return;
    
    metricsStarted.current = true;
    
    // Reset metrics if switching from traditional to HotLabel
    if (!isEnabled) {
      setTasksCompleted(0);
      setPublisherEarnings(0);
      setUserExperience(7.5);
      setAdsBlocked(0);
    }
    
    // Update metrics periodically (simulating user interactions)
    metricsInterval.current = window.setInterval(() => {
      // Randomly complete tasks with a more stable algorithm
      if (Math.random() < 0.3) { // 30% chance each interval
        setTasksCompleted(prev => prev + 1);
        setPublisherEarnings(prev => {
          const increment = 0.04; // Fixed increment for stability
          return parseFloat((prev + increment).toFixed(2));
        });
        
        // Update user experience score with less variation
        setUserExperience(prev => {
          const newValue = Math.min(prev + 0.1, 10.0); // Smaller increment
          return parseFloat(newValue.toFixed(1));
        });
        
        // Each task blocks approximately 3 ads
        setAdsBlocked(prev => prev + 3);
      }
    }, 3000);
  };

  const stopMetricsUpdates = () => {
    if (metricsInterval.current) {
      window.clearInterval(metricsInterval.current);
      metricsInterval.current = null;
      metricsStarted.current = false;
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
            />
            <Label htmlFor="hotlabel-toggle" className="text-sm">
              Use HotLabel
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