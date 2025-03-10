
import React, { useState, useEffect } from "react";
import { AdContent } from "@/utils/fileData";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopupAdProps {
  ad: AdContent;
  onClose: () => void;
  position: "center" | "top-right" | "bottom-left" | "bottom-right" | "top-left";
  delay?: number;
  className?: string;
}

const PopupAd: React.FC<PopupAdProps> = ({ 
  ad, 
  onClose, 
  position = "center",
  delay = 0,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "top-left":
        return "top-4 left-4";
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed z-50",
        getPositionClasses(),
        isVisible && !isClosing ? "animate-scale-in" : isClosing ? "animate-scale-out" : "",
        className
      )}
    >
      <div 
        className={cn(
          "glass-card",
          "w-80 sm:w-96 rounded-2xl overflow-hidden",
          "transition-all duration-300"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
        
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/40 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="p-6 relative z-[1]">
          <div className="mb-1">
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              Sponsored
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{ad.description}</p>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleClose}
              className="text-sm"
              size="sm"
            >
              Not now
            </Button>
            
            <Button 
              onClick={() => {
                window.open(ad.ctaLink, "_blank");
                handleClose();
              }}
              className="relative overflow-hidden group/button ml-2"
            >
              <span className="relative z-10">{ad.cta}</span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupAd;
