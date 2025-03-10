
import React from "react";
import { FileItem } from "@/utils/fileData";
import { cn } from "@/lib/utils";
import { FileIcon, FileImage, FileAudio2, FileVideo, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  file: FileItem;
  onDownload: (file: FileItem) => void;
  className?: string;
}

const FileCard: React.FC<FileCardProps> = ({ file, onDownload, className }) => {
  const getFileIcon = () => {
    switch (file.type) {
      case "image":
        return <FileImage className="w-6 h-6 text-blue-500" />;
      case "audio":
        return <FileAudio2 className="w-6 h-6 text-purple-500" />;
      case "video":
        return <FileVideo className="w-6 h-6 text-red-500" />;
      case "archive":
        return <Archive className="w-6 h-6 text-amber-500" />;
      default:
        return <FileIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-300",
        "bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl",
        "border border-gray-100 dark:border-gray-800",
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              {getFileIcon()}
            </div>
            <div>
              <h3 className="font-medium text-lg">{file.name}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(file.date)}</p>
            </div>
          </div>
          <div className="text-sm font-mono text-muted-foreground">{file.size}</div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-5">{file.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold">{file.downloadCount.toLocaleString()}</span> downloads
          </div>
          <Button 
            onClick={() => onDownload(file)}
            className="relative overflow-hidden group/button"
            variant="default"
          >
            <span className="relative z-10">Download</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
