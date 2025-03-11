import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileItem } from "@/utils/fileData";
import { cn } from "@/lib/utils";
import { Download, Lock, Shield, CheckCircle, Clock } from "lucide-react";

interface DownloadModalProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onDownloadConfirm: () => void;
  hotLabelEnabled: boolean;
  downloadReady: boolean;
  className?: string;
}

// Define types for task data
interface TaskContent {
  image?: {
    url: string;
    alt_text?: string;
  };
  text?: {
    text: string;
  };
  audio?: {
    url: string;
    duration_seconds?: number;
  };
}

interface Task {
  task_id: string;
  track_id: string;
  language: string;
  category: string;
  type: string;
  topic: string;
  complexity: number;
  content: TaskContent;
  task: {
    text: string;
    choices: Record<string, string>;
  };
  status: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  file,
  isOpen,
  onClose,
  onDownloadConfirm,
  hotLabelEnabled,
  downloadReady,
  className,
}) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [countDown, setCountDown] = useState(5);
  const [showHotLabelTask, setShowHotLabelTask] = useState(false);
  const [hotLabelTaskCompleted, setHotLabelTaskCompleted] = useState(false);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  
  // API endpoint for server
  const API_ENDPOINT = "http://localhost:8000";

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDownloadProgress(0);
      setIsDownloading(false);
      setIsComplete(false);
      setCountDown(5);
      setShowHotLabelTask(false);
      setHotLabelTaskCompleted(false);
      setTaskData(null);
      setIsLoadingTask(false);
      setTaskError(null);
    }
  }, [isOpen]);

  // Load task data when showing HotLabel task
  useEffect(() => {
    if (showHotLabelTask && !taskData && !isLoadingTask && !taskError) {
      fetchTask();
    }
  }, [showHotLabelTask, taskData, isLoadingTask, taskError]);

  // Simulate download progress
  useEffect(() => {
    let timer: number;
    if (isDownloading && downloadProgress < 100) {
      timer = window.setTimeout(() => {
        const nextProgress = downloadProgress + (Math.random() * 15);
        setDownloadProgress(Math.min(nextProgress, 100));
        
        if (nextProgress >= 100) {
          setIsComplete(true);
          setIsDownloading(false);
        }
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isDownloading, downloadProgress]);

  // Handle countdown for traditional download
  useEffect(() => {
    let timer: number;
    if (isOpen && countDown > 0 && !hotLabelEnabled) {
      timer = window.setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, countDown, hotLabelEnabled]);

  // Fetch a task from the server
  const fetchTask = useCallback(async () => {
    setIsLoadingTask(true);
    setTaskError(null);
    
    try {
      // Prepare user profile data
      const profile = getUserProfileData();
      
      // Generate session ID if not already in local storage
      const sessionId = localStorage.getItem('hotlabel_session_id') || 
        `session-${Math.random().toString(36).substring(2, 15)}`;
      
      // Store session ID
      if (!localStorage.getItem('hotlabel_session_id')) {
        localStorage.setItem('hotlabel_session_id', sessionId);
      }
      
      // Request a task from the server
      const response = await fetch(`${API_ENDPOINT}/tasks/request?session_id=${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const task = await response.json();
      
      if (!task || Object.keys(task).length === 0) {
        // No task available
        throw new Error("No tasks available");
      }
      
      // Store the task
      setTaskData(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      setTaskError(error instanceof Error ? error.message : "Failed to load task");
      
      // Fall back to mock data if needed
      setTaskData(getMockTask());
    } finally {
      setIsLoadingTask(false);
    }
  }, [API_ENDPOINT]);
  
  // Get user profile data for task request
  const getUserProfileData = () => {
    // Get browser language
    const language = navigator.language || 'en';
    const preferredLanguages = navigator.languages || [language];
    
    // Get platform and device info
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Get current page info
    const currentSite = window.location.hostname;
    
    return {
      browser_info: {
        user_agent: userAgent,
        language: language,
        preferred_languages: preferredLanguages,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        platform: platform,
        is_mobile: isMobile
      },
      recent_sites: [currentSite],
      current_site_category: "downloads",
      current_page_topic: "file-downloads",
      time_on_page: 60, // Placeholder
      interaction_depth: 0.5 // Placeholder
    };
  };
  
  // Get a mock task when server is unavailable
  const getMockTask = (): Task => {
    return {
      task_id: `mock-${Math.random().toString(36).substring(2, 9)}`,
      track_id: "mock-track",
      language: "en",
      category: "vqa",
      type: "true-false",
      topic: "formula1",
      complexity: 1,
      content: {
        image: {
          url: "https://s3-eu-north-1-derc-wmi-crowdlabel-placeholder.s3.eu-north-1.amazonaws.com/TII-VQA_F1_000001.png"
        }
      },
      task: {
        text: "Are any cyan wheel guns visible?",
        choices: {
          "a": "true",
          "b": "false"
        }
      },
      status: "pending"
    };
  };

  const startDownload = () => {
    setIsDownloading(true);
    onDownloadConfirm();
  };

  const handleDownloadClick = () => {
    if (hotLabelEnabled && !hotLabelTaskCompleted) {
      // Show HotLabel task instead of starting download
      setShowHotLabelTask(true);
    } else {
      // Traditional download flow
      startDownload();
    }
  };

  const handleTaskSelection = async (choice: string) => {
    if (!taskData) return;
    
    console.log("Task choice selected:", choice);
    
    // Submit response to server
    try {
      const sessionId = localStorage.getItem('hotlabel_session_id') || 
        `session-${Math.random().toString(36).substring(2, 15)}`;
      
      const response = await fetch(`${API_ENDPOINT}/responses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id: taskData.task_id,
          session_id: sessionId,
          response_data: { selected_choice: choice },
          response_time_ms: 3000, // Approximate time
          client_metadata: {
            browser: getBrowserName(),
            device_type: getDeviceType(),
            interaction_count: 1
          }
        })
      });
      
      if (!response.ok) {
        console.warn("Response submission had an issue:", response.status);
        // Continue anyway
      } else {
        console.log("Response submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      // Continue anyway
    }
    
    // Mark task as completed
    setHotLabelTaskCompleted(true);
    
    // Dispatch a custom event for task completion
    const taskId = taskData.task_id;
    const customEvent = new CustomEvent('hotlabel-task-completed', {
      detail: { 
        adId: `modal-ad-${Date.now()}`, 
        taskId: taskId,
        choice: choice
      }
    });
    document.dispatchEvent(customEvent);
    console.log("Dispatched task completion event from modal:", taskId);
    
    // Show completion message and start download after delay
    setTimeout(() => {
      // Start download automatically when task is completed
      startDownload();
      
      // Close the modal after a delay to allow success message to be seen
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };
  
  // Helper functions for browser metadata
  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };
  
  const getDeviceType = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      ? 'mobile' 
      : 'desktop';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div 
        className={cn(
          "w-full max-w-md glass-card animate-scale-in",
          "p-6 rounded-2xl relative overflow-hidden",
          className
        )}
      >
        <div className="absolute top-0 left-0 w-full h-1.5">
          <div 
            className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${isDownloading ? downloadProgress : 0}%` }}
          />
        </div>
        
        {/* Initial download screen */}
        {!isDownloading && !isComplete && !showHotLabelTask && (
          <>
            <div className="text-center mb-6 mt-4">
              <h3 className="text-2xl font-semibold mb-2">Download Ready</h3>
              <p className="text-muted-foreground">You're about to download:</p>
              <p className="font-medium mt-1">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Size: {file.size}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <div className="text-sm">
                    <p className="font-medium">Virus Scanned</p>
                    <p className="text-muted-foreground">This file is safe to download</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-amber-500" />
                  <div className="text-sm">
                    <p className="font-medium">{hotLabelEnabled ? "AI Task Required" : "Standard Download"}</p>
                    <p className="text-muted-foreground">
                      {hotLabelEnabled 
                        ? "Complete one quick task instead of multiple ads" 
                        : "Speed limited to 1 MB/s"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                
                <Button 
                  className="flex-1 relative overflow-hidden" 
                  onClick={handleDownloadClick}
                  // Only enable when using HotLabel OR all traditional ads are closed
                  disabled={!hotLabelEnabled && !downloadReady && countDown > 0}
                >
                  {!hotLabelEnabled && !downloadReady ? (
                    <div className="flex items-center">
                      {countDown > 0 ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-pulse" />
                          <span>Wait {countDown}s</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          <span>Close All Ads First</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      <span>{hotLabelEnabled ? "Continue" : "Download"}</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
        
        {/* HotLabel Task UI */}
        {showHotLabelTask && !isDownloading && !isComplete && (
          <div className="py-2">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">Complete Task to Download</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Answer one question to continue your download
              </p>
            </div>
            
            {isLoadingTask ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <p>Loading AI task...</p>
                </div>
              </div>
            ) : taskError ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500 mb-2">Error loading task</p>
                  <p className="text-sm text-muted-foreground">{taskError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={fetchTask}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : hotLabelTaskCompleted ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="font-semibold text-lg mb-1">Thank you!</p>
                <p className="text-muted-foreground">Your response helps improve AI systems</p>
              </div>
            ) : taskData ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="mb-4">
                  <p className="text-center font-semibold mb-3">{taskData.task.text}</p>
                  {taskData.content.image && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={taskData.content.image.url} 
                        alt="Task visual" 
                        className="rounded-md max-h-[200px] object-contain"
                      />
                    </div>
                  )}
                  {taskData.content.text && (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 mb-4">
                      <p className="text-sm">{taskData.content.text.text}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3 mt-4">
                  {Object.entries(taskData.task.choices).map(([key, value]) => (
                    <Button 
                      key={key}
                      variant="outline"
                      className="w-full justify-center text-center py-2"
                      onClick={() => handleTaskSelection(key)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <p>No tasks available</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={fetchTask}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Your contribution helps improve AI systems
              </p>
            </div>
          </div>
        )}
        
        {/* Download Progress UI */}
        {isDownloading && (
          <div className="text-center py-6">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <svg className="animate-spin w-full h-full" viewBox="0 0 50 50">
                <circle
                  className="stroke-gray-200 dark:stroke-gray-600"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="transparent"
                  r="20"
                  cx="25"
                  cy="25"
                />
                <circle
                  className="stroke-primary"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="20"
                  cx="25"
                  cy="25"
                  strokeDasharray={`${downloadProgress * 1.26} 1000`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                {Math.round(downloadProgress)}%
              </div>
            </div>
            <p className="text-muted-foreground">Downloading your file...</p>
            <p className="text-sm text-muted-foreground mt-1">Please don't close this window</p>
          </div>
        )}
        
        {/* Download Complete UI */}
        {isComplete && (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h4 className="font-semibold text-xl mb-1">Download Complete</h4>
            <p className="text-muted-foreground mb-6">Your file has been downloaded successfully</p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;