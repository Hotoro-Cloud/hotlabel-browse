import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle, Clock, ArrowRight } from "lucide-react";

const IntegrationTimerDemo = () => {
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(300); // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Website view state
  const [currentTab, setCurrentTab] = useState("before");
  const [adsReady, setAdsReady] = useState(true);
  const [hotlabelReady, setHotlabelReady] = useState(false);
  
  // Integration steps
  const integrationSteps = [
    {
      name: "Remove Ad Network SDK",
      time: 45, // seconds
      code: `<!-- Remove this -->
<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
<script>
  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
    googletag.defineSlot('/22639388115/aec_ed', [[300, 250]], 'div-gpt-ad-1').addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });
</script>`
    },
    {
      name: "Add HotLabel SDK",
      time: 45,
      code: `<!-- Add this instead -->
<script src="https://cdn.hotlabel.ai/sdk/v1/hotlabel.min.js"></script>
<script>
  window.HotLabel.init({
    publisherId: "your-publisher-id",
    adSlotSelector: ".ad-container",
    apiEndpoint: "https://api.hotlabel.ai/v1",
    theme: "light" // or "dark"
  });
</script>`
    },
    {
      name: "Update Ad Containers",
      time: 60,
      code: `<!-- Keep your existing ad containers, just add the class -->
<div id="div-gpt-ad-1" class="ad-container">
  <!-- HotLabel will automatically replace ads here -->
</div>`
    },
    {
      name: "Test Integration",
      time: 60,
      code: `// No additional code needed!
// HotLabel automatically detects and replaces ads
// in containers with the specified class.

// Optional: Add event listeners for analytics
document.addEventListener('hotlabel-task-completed', function(e) {
  console.log('Task completed:', e.detail);
  // Track completion in your analytics
});`
    },
    {
      name: "Integration Complete!",
      time: 30,
      code: `// 🎉 Congratulations! 🎉
// You've successfully integrated HotLabel!

// Your website is now:
// ✓ Generating 10-15x more revenue
// ✓ Providing a better user experience
// ✓ Contributing to AI advancement
// ✓ Free from annoying popup ads`
    }
  ];
  
  // Before and after website HTML
  const websiteBeforeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechNews Daily</title>
  
  <!-- Ad Network SDK -->
  <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
  <script>
    window.googletag = window.googletag || {cmd: []};
    googletag.cmd.push(function() {
      googletag.defineSlot('/22639388115/aec_ed', [[300, 250]], 'div-gpt-ad-1').addService(googletag.pubads());
      googletag.defineSlot('/22639388115/aec_ed', [[300, 250]], 'div-gpt-ad-2').addService(googletag.pubads());
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
  </script>
  
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; }
    .main-content { display: grid; grid-template-columns: 1fr 300px; gap: 20px; margin-top: 20px; }
    .content { border: 1px solid #eee; padding: 20px; }
    .sidebar { display: flex; flex-direction: column; gap: 20px; }
    .ad-box { width: 300px; height: 250px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
    .article-footer { margin-top: 20px; }
  </style>
</head>
<body>
  <header>
    <h1>TechNews Daily</h1>
    <nav>
      <a href="#">Home</a> | 
      <a href="#">Technology</a> | 
      <a href="#">Business</a> | 
      <a href="#">Science</a>
    </nav>
  </header>
  
  <div class="main-content">
    <div class="content">
      <h2>Latest AI Advancements Revolutionize Healthcare</h2>
      <p>New breakthrough in artificial intelligence is changing how doctors diagnose rare diseases...</p>
      <p>Researchers at leading universities have developed algorithms that can detect patterns in medical imaging that human doctors might miss...</p>
      
      <!-- In-article ad -->
      <div id="div-gpt-ad-1" class="ad-box">
        <!-- Ad will be inserted here by the ad network -->
        Traditional Ad - Low Revenue, Poor UX
      </div>
      
      <p>The technology is already being deployed in several major hospitals across the country...</p>
      <p>Patient outcomes have improved by an estimated 23% in early trials...</p>
      
      <div class="article-footer">
        <h3>Related Articles</h3>
        <ul>
          <li>Machine Learning Models Predict Drug Interactions</li>
          <li>Virtual Reality Used in Surgical Training</li>
          <li>New Mobile App Helps Patients Manage Chronic Conditions</li>
        </ul>
      </div>
    </div>
    
    <div class="sidebar">
      <!-- Sidebar ad -->
      <div id="div-gpt-ad-2" class="ad-box">
        <!-- Ad will be inserted here by the ad network -->
        Traditional Ad - Low Revenue, Poor UX
      </div>
      
      <div class="popular-posts">
        <h3>Popular Posts</h3>
        <ul>
          <li>Top 10 Tech Trends for 2025</li>
          <li>Review: New Quantum Computing Breakthrough</li>
          <li>How Blockchain is Transforming Supply Chains</li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  const websiteAfterHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechNews Daily</title>
  
  <!-- HotLabel SDK -->
  <script src="https://cdn.hotlabel.ai/sdk/v1/hotlabel.min.js"></script>
  <script>
    window.HotLabel.init({
      publisherId: "your-publisher-id",
      adSlotSelector: ".ad-container",
      apiEndpoint: "https://api.hotlabel.ai/v1",
      theme: "light"
    });
  </script>
  
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; }
    .main-content { display: grid; grid-template-columns: 1fr 300px; gap: 20px; margin-top: 20px; }
    .content { border: 1px solid #eee; padding: 20px; }
    .sidebar { display: flex; flex-direction: column; gap: 20px; }
    .ad-box { width: 300px; height: 250px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
    .article-footer { margin-top: 20px; }
  </style>
</head>
<body>
  <header>
    <h1>TechNews Daily</h1>
    <nav>
      <a href="#">Home</a> | 
      <a href="#">Technology</a> | 
      <a href="#">Business</a> | 
      <a href="#">Science</a>
    </nav>
  </header>
  
  <div class="main-content">
    <div class="content">
      <h2>Latest AI Advancements Revolutionize Healthcare</h2>
      <p>New breakthrough in artificial intelligence is changing how doctors diagnose rare diseases...</p>
      <p>Researchers at leading universities have developed algorithms that can detect patterns in medical imaging that human doctors might miss...</p>
      
      <!-- In-article ad with HotLabel -->
      <div id="div-gpt-ad-1" class="ad-container ad-box">
        <!-- HotLabel task will appear here -->
        HotLabel Task - High Revenue, Better UX
      </div>
      
      <p>The technology is already being deployed in several major hospitals across the country...</p>
      <p>Patient outcomes have improved by an estimated 23% in early trials...</p>
      
      <div class="article-footer">
        <h3>Related Articles</h3>
        <ul>
          <li>Machine Learning Models Predict Drug Interactions</li>
          <li>Virtual Reality Used in Surgical Training</li>
          <li>New Mobile App Helps Patients Manage Chronic Conditions</li>
        </ul>
      </div>
    </div>
    
    <div class="sidebar">
      <!-- Sidebar ad with HotLabel -->
      <div id="div-gpt-ad-2" class="ad-container ad-box">
        <!-- HotLabel task will appear here -->
        HotLabel Task - High Revenue, Better UX
      </div>
      
      <div class="popular-posts">
        <h3>Popular Posts</h3>
        <ul>
          <li>Top 10 Tech Trends for 2025</li>
          <li>Review: New Quantum Computing Breakthrough</li>
          <li>How Blockchain is Transforming Supply Chains</li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  // Handle starting the integration demo
  const startIntegration = () => {
    setIsRunning(true);
    setTimeRemaining(totalTime);
    setCurrentStep(0);
    setCompletedSteps([]);
    
    // Reset website state
    setCurrentTab("before");
    setAdsReady(true);
    setHotlabelReady(false);
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Set up the step progression
    progressSteps();
  };
  
  // Reset the demo
  const resetDemo = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRunning(false);
    setTimeRemaining(totalTime);
    setCurrentStep(0);
    setCompletedSteps([]);
    setCurrentTab("before");
    setAdsReady(true);
    setHotlabelReady(false);
  };
  
  // Progress through integration steps automatically
  const progressSteps = () => {
    let timeElapsed = 0;
    
    integrationSteps.forEach((step, index) => {
      timeElapsed += step.time;
      
      // Schedule step completion
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        setCurrentStep(index + 1);
        
        // Update website view when appropriate steps are completed
        if (index === 0) {
          setAdsReady(false);
        }
        
        if (index === 1) {
          setHotlabelReady(true);
          setCurrentTab("after");
        }
        
        // Final step - integration complete
        if (index === integrationSteps.length - 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
        }
      }, step.time * 1000);
    });
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate time percentage
  const timePercentage = Math.max(0, (timeRemaining / totalTime) * 100);
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Timer header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">5-Minute Integration Challenge</h2>
          <p className="text-muted-foreground">
            Watch how quickly you can replace traditional ads with HotLabel
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isRunning ? (
            <div className="text-2xl font-mono font-bold">
              {formatTime(timeRemaining)}
            </div>
          ) : (
            <>
              {completedSteps.length === integrationSteps.length ? (
                <Badge variant="default" className="text-md px-3 py-1 bg-green-500">
                  Completed in {formatTime(totalTime - timeRemaining)}
                </Badge>
              ) : (
                <Button onClick={startIntegration} size="lg">
                  <Clock className="mr-2 h-4 w-4" /> Start 5-Minute Integration
                </Button>
              )}
            </>
          )}
          
          {(isRunning || completedSteps.length > 0) && (
            <Button variant="outline" onClick={resetDemo}>
              Reset Demo
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress indicators */}
      {(isRunning || completedSteps.length > 0) && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Step {Math.min(currentStep + 1, integrationSteps.length)} of {integrationSteps.length}
            </span>
            <span className="text-sm font-medium">
              {isRunning ? `${formatTime(timeRemaining)} remaining` : 'Integration complete!'}
            </span>
          </div>
          <Progress value={isRunning ? timePercentage : 100} className="h-2" />
        </div>
      )}
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Integration steps */}
        <div>
          <Card className="h-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Integration Steps</h3>
              
              <div className="space-y-4">
                {integrationSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-4 p-4 rounded-lg ${
                      currentStep === index 
                        ? 'bg-primary/10 border border-primary/20' 
                        : completedSteps.includes(index)
                          ? 'bg-green-50 dark:bg-green-950/20'
                          : 'bg-gray-50 dark:bg-gray-900/20'
                    }`}
                  >
                    <div className="mt-0.5">
                      {completedSteps.includes(index) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : currentStep === index ? (
                        <Circle className="h-5 w-5 text-primary animate-pulse" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{step.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {step.time} sec
                        </span>
                      </div>
                      
                      {(currentStep === index || completedSteps.includes(index)) && (
                        <pre className="mt-3 p-3 bg-black/80 text-white rounded-md text-xs overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right side: Website preview */}
        <div>
          <Card className="h-full overflow-hidden">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
              <div className="px-6 pt-6 pb-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Website Preview</h3>
                  <TabsList>
                    <TabsTrigger value="before" disabled={isRunning && !adsReady}>
                      Before
                    </TabsTrigger>
                    <TabsTrigger value="after" disabled={isRunning && !hotlabelReady}>
                      After
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex gap-2 text-xs mb-3">
                  <Badge variant={currentTab === "before" ? "default" : "outline"}>
                    Traditional Ads
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={currentTab === "after" ? "default" : "outline"}>
                    HotLabel Tasks
                  </Badge>
                </div>
              </div>
              
              <TabsContent value="before" className="flex-1 overflow-auto m-0 bg-gray-50 dark:bg-gray-900/20 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-auto h-full">
                  <pre className="p-4 text-xs whitespace-pre-wrap">
                    <code>{websiteBeforeHtml}</code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="after" className="flex-1 overflow-auto m-0 bg-gray-50 dark:bg-gray-900/20 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-auto h-full">
                  <pre className="p-4 text-xs whitespace-pre-wrap">
                    <code>{websiteAfterHtml}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      
      {/* Results section - only show after completion */}
      {completedSteps.length === integrationSteps.length && (
        <Card className="mt-8 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Integration Complete!</h3>
            </div>
            
            <p className="mb-6">
              You've successfully replaced traditional ads with HotLabel in just {formatTime(totalTime - timeRemaining)}! 
              Your website is now ready to generate more revenue while providing a better user experience.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Revenue Increase</h4>
                <div className="text-2xl font-bold text-green-500">+1,150%</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Integration Time</h4>
                <div className="text-2xl font-bold">{formatTime(totalTime - timeRemaining)}</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Code Changes</h4>
                <div className="text-2xl font-bold">5 lines</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">User Experience</h4>
                <div className="text-2xl font-bold text-green-500">+270%</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default IntegrationTimerDemo;