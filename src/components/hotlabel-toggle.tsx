
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
    
    // Reset metrics
    setTasksCompleted(0);
    setPublisherEarnings(0);
    setUserExperience(7.5);
    setAdsBlocked(0);
    
    // Update metrics periodically (simulating user interactions)
    metricsInterval.current = window.setInterval(() => {
      // Randomly complete tasks with a more stable algorithm
      if (Math.random() < 0.3) { // 30% chance each interval
        setTasksCompleted(prev => prev + 1);
        setPublisherEarnings(prev => {
          const increment = 0.02; // Fixed increment for stability
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

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(e.target.checked);
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
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isEnabled}
              onChange={handleToggleChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Use HotLabel
            </span>
          </label>
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