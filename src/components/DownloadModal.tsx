
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileItem } from "@/utils/fileData";
import { cn } from "@/lib/utils";
import { Download, Lock, Shield, CheckCircle, Clock } from "lucide-react";

interface DownloadModalProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onDownloadConfirm: () => void;
  className?: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  file,
  isOpen,
  onClose,
  onDownloadConfirm,
  className,
}) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [countDown, setCountDown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setDownloadProgress(0);
      setIsDownloading(false);
      setIsComplete(false);
      setCountDown(5);
    }
  }, [isOpen]);

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

  useEffect(() => {
    let timer: number;
    if (isOpen && countDown > 0) {
      timer = window.setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, countDown]);

  const handleDownloadStart = () => {
    setIsDownloading(true);
    onDownloadConfirm();
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
        
        <div className="text-center mb-6 mt-4">
          <h3 className="text-2xl font-semibold mb-2">Download Ready</h3>
          <p className="text-muted-foreground">You're about to download:</p>
          <p className="font-medium mt-1">{file.name}</p>
          <p className="text-sm text-muted-foreground mt-1">Size: {file.size}</p>
        </div>
        
        {!isDownloading && !isComplete && (
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
                  <p className="font-medium">Standard Download</p>
                  <p className="text-muted-foreground">Speed limited to 1 MB/s</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              
              <Button 
                className="flex-1 relative overflow-hidden" 
                onClick={handleDownloadStart}
                disabled={countDown > 0}
              >
                {countDown > 0 ? (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 animate-pulse" />
                    <span>Wait {countDown}s</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}
        
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
