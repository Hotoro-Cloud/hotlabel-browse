import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileItem } from "@/utils/fileData";
import { cn } from "@/lib/utils";
import { Download, Lock, Shield, CheckCircle, Clock } from "lucide-react";

// Mock task data
const mockTaskData = {
  "task_id": "task_12345",
  "track_id": "track_67890",
  "language": "en",
  "category": "vqa",
  "type": "true-false",
  "topic": "formula1",
  "complexity": 1,
  "content": {
    "image": {
      "url": "https://s3-eu-north-1-derc-wmi-crowdlabel-placeholder.s3.eu-north-1.amazonaws.com/TII-VQA_F1_000001.png"
    }
  },
  "task": {
    "text": "Are any cyan wheel guns visible?",
    "choices": {
      "a": "true",
      "b": "false"
    }
  }
};

interface DownloadModalProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onDownloadConfirm: () => void;
  hotLabelEnabled: boolean; // Add this prop to know if HotLabel is enabled
  className?: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  file,
  isOpen,
  onClose,
  onDownloadConfirm,
  hotLabelEnabled,
  className,
}) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [countDown, setCountDown] = useState(5);
  const [showHotLabelTask, setShowHotLabelTask] = useState(false);
  const [hotLabelTaskCompleted, setHotLabelTaskCompleted] = useState(false);
  const [taskData, setTaskData] = useState<typeof mockTaskData | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setDownloadProgress(0);
      setIsDownloading(false);
      setIsComplete(false);
      setCountDown(5);
      setShowHotLabelTask(false);
      setHotLabelTaskCompleted(false);
      setTaskData(null);
      setIsLoadingTask(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Load task data when showing HotLabel task
    if (showHotLabelTask && !taskData && !isLoadingTask) {
      setIsLoadingTask(true);
      // Simulate API fetch with a delay
      setTimeout(() => {
        setTaskData(mockTaskData);
        setIsLoadingTask(false);
      }, 1000);
    }
  }, [showHotLabelTask, taskData, isLoadingTask]);

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

  const handleTaskSelection = (choice: string) => {
    console.log("Task choice selected:", choice);
    // Simulate task completion
    setHotLabelTaskCompleted(true);
    
    // Show completion message
    setTimeout(() => {
      // Start download automatically when task is completed
      startDownload();
    }, 1000);
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
                  disabled={!hotLabelEnabled && countDown > 0}
                >
                  {!hotLabelEnabled && countDown > 0 ? (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 animate-pulse" />
                      <span>Wait {countDown}s</span>
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
            
            {isLoadingTask && !taskData ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <p>Loading AI task...</p>
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
            ) : null}
            
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