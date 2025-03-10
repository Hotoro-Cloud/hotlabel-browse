import React, { useState, useEffect } from "react";
import { fileData, FileItem, adData } from "@/utils/fileData";
import FileCard from "@/components/FileCard";
import PopupAd from "@/components/PopupAd";
import DownloadModal from "@/components/DownloadModal";
import AnimatedBackground from "@/components/AnimatedBackground";
import HotLabelToggle from "@/components/hotlabel-toggle";
import { ArrowDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Define animations that will be used 
const AnimationStyles = () => (
  <style>
    {`
      @keyframes scale-in {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes scale-out {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
      }
      
      @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
      }
      
      .animate-scale-in {
        animation: scale-in 0.3s ease-out forwards;
      }
      
      .animate-scale-out {
        animation: scale-out 0.3s ease-in forwards;
      }
      
      .animate-pulse {
        animation: pulse 2s ease-in-out infinite;
      }
    `}
  </style>
);

const Index = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAds, setActiveAds] = useState<Array<{ id: string; position: "center" | "top-right" | "bottom-left" | "bottom-right" | "top-left"; }>>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hotLabelEnabled, setHotLabelEnabled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle scrolling effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for hotlabel-task-completed events
  useEffect(() => {
    const handleTaskCompleted = (event: CustomEvent) => {
      console.log("Task completed event received:", event.detail);
      const { adId, taskId } = event.detail;
      
      if (adId) {
        // Add a small delay to allow completion animation to play
        setTimeout(() => {
          handleCloseAd(adId);
          
          // Show a success notification
          toast({
            title: "Task completed!",
            description: "Thanks for your contribution. Your download will start shortly.",
          });
          
          // Mark as downloading
          setIsDownloading(true);
          
          // If all ads are closed, simulate file being downloaded
          if (selectedFile) {
            simulateDownload();
            setTimeout(() => {
              setIsDownloading(false);
            }, 1000);
          }
        }, 500);
      }
    };

    document.addEventListener('hotlabel-task-completed', handleTaskCompleted as EventListener);
    
    return () => {
      document.removeEventListener('hotlabel-task-completed', handleTaskCompleted as EventListener);
    };
  }, [selectedFile]);
  

  const filteredFiles = searchTerm
    ? fileData.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : fileData;

  const handleDownloadClick = (file: FileItem) => {
    setSelectedFile(file);
    setIsDownloadModalOpen(true);
  };

  const handleDownloadConfirm = () => {
    // With the new approach, we don't need to show popup ads when using HotLabel
    // as the task will be directly embedded in the download modal
    if (!hotLabelEnabled) {
      // Traditional multiple popup ads flow
      const adPositions: Array<"center" | "top-right" | "bottom-left" | "bottom-right" | "top-left"> = ["top-right", "bottom-left", "bottom-right", "top-left"];
      
      // First ad (fixed position - center)
      setActiveAds([{ id: `popup-${Date.now()}-1`, position: "center" }]);
      
      toast({
        title: "Popup ads appearing",
        description: "Close all ads to continue your download",
      });
      
      // Second and third ads with delays
      setTimeout(() => {
        setActiveAds(prev => [
          ...prev, 
          { 
            id: `popup-${Date.now()}-2`, 
            position: adPositions[Math.floor(Math.random() * adPositions.length)]
          }
        ]);
      }, 1500);
      
      setTimeout(() => {
        setActiveAds(prev => [
          ...prev, 
          { 
            id: `popup-${Date.now()}-3`, 
            position: adPositions[Math.floor(Math.random() * adPositions.length)]
          }
        ]);
      }, 3000);
    }
  };

  // Simulate immediate download when all tasks/ads are closed
  const simulateDownload = () => {
    if (selectedFile) {
      const mockFileObjectUrl = URL.createObjectURL(new Blob(['mock content'], { type: 'text/plain' }));
      const link = document.createElement('a');
      link.href = mockFileObjectUrl;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download successful!",
        description: `${selectedFile.name} has been downloaded.`,
      });
    }
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  const handleCloseAd = (adId: string) => {
    setActiveAds(prev => prev.filter(ad => ad.id !== adId));
    
    // When all ads are closed, simulate file being downloaded
    if (activeAds.length === 1 && selectedFile && !isDownloading) {
      simulateDownload();
    }
  };

  // Handle HotLabel toggle state changes
  const handleHotLabelToggle = (enabled: boolean) => {
    setHotLabelEnabled(enabled);
    
    if (enabled) {
      // Clear any active ads when HotLabel is enabled
      setActiveAds([]);
      
      toast({
        title: hotLabelEnabled ? "HotLabel Disabled" : "HotLabel Enabled",
        description: hotLabelEnabled 
          ? "Switched back to traditional popup ads"
          : "Now you'll solve one AI task instead of multiple popups",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimationStyles />
      <AnimatedBackground />
      
      {/* HotLabelToggle Component */}
      <HotLabelToggle 
        onChange={handleHotLabelToggle}
      />
      
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-30 transition-all duration-300 py-4",
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg">F</div>
            <h1 className="text-xl font-semibold">FileVault</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Browse</Button>
            <Button variant="ghost">About</Button>
            <Button variant="default" className="ml-2">Go Premium</Button>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </header>
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Download Files with <span className="text-gradient">Ease</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Fast, secure, and convenient file downloads for all your needs
            </p>
            
            <div className="relative max-w-xl mx-auto mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-lg blur-xl"></div>
              <div className="relative flex items-center rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg bg-background">
                <Search className="absolute left-3 text-muted-foreground w-5 h-5" />
                <Input 
                  type="text"
                  placeholder="Search for files..."
                  className="pl-10 py-6 border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="absolute right-1.5">
                  Search
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex items-center justify-center animate-bounce">
              <ArrowDown className="h-8 w-8 text-muted-foreground opacity-70" />
            </div>
          </div>
        </section>
        
        {/* Files Section */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-8">
            {searchTerm ? "Search Results" : "Popular Files"}
          </h2>
          
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  onDownload={handleDownloadClick}
                  className="animate-fade-in" 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No files found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold">F</div>
                <span className="font-semibold">FileVault</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Download files with ease and security
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Contact</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">About</a>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} FileVault. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      
     {/* Download Modal */}
      {selectedFile && (
        <DownloadModal
          file={selectedFile}
          isOpen={isDownloadModalOpen}
          onClose={handleCloseDownloadModal}
          onDownloadConfirm={handleDownloadConfirm}
          hotLabelEnabled={hotLabelEnabled}
        />
      )}
      
      {/* Popup Ads - Only show when HotLabel is disabled */}
      {!hotLabelEnabled && activeAds.map((ad, index) => (
        <PopupAd
          key={ad.id}
          ad={adData[index % adData.length]}
          onClose={() => handleCloseAd(ad.id)}
          position={ad.position}
          delay={index * 200}
          className="popup-ad"
        />
      ))}
    </div>
  );
};

export default Index;