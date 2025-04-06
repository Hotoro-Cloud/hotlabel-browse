import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import Editor from "@monaco-editor/react";

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
      name: "Remove Popup Ad Code",
      time: 45,
      code: `<!-- Remove intrusive popup ad code -->
<script>
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.innerHTML = \`
        <div class="popup-overlay">
          <div class="popup-content">
            <h3>Wait! Before you download...</h3>
            <div class="ad-space"><!-- Ad content --></div>
            <button onclick="closePopup()">
              Continue to Download (15s)
            </button>
          </div>
        </div>
      \`;
      document.body.appendChild(popup);
    }, 1000);
  });
</script>

<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 1000;
  }
  .popup-content {
    /* Intrusive popup styling */
  }
</style>`
    },
    {
      name: "Add HotLabel AI Tasks",
      time: 45,
      code: `<!-- Add HotLabel SDK -->
<script src="https://cdn.hotlabel.ai/sdk/v1/hotlabel.min.js"></script>
<script>
  window.HotLabel.init({
    publisherId: "your-publisher-id",
    taskType: "pre-action", // Shows task before user action
    theme: "light"
  });
</script>

<!-- Add to your download button -->
<button 
  data-hotlabel="download"
  onclick="startDownload()">
  Download Now
</button>`
    },
    {
      name: "Configure User Flow",
      time: 30,
      code: `// Configure the download flow
function startDownload() {
  // HotLabel will automatically show an AI task
  // before initiating the download
  
  // The download will start after task completion
  window.HotLabel.onTaskComplete(() => {
    // Start your download here
    initiateDownload();
  });
}`
    }
  ];
  
  // Update the movie poster URL to use Les Aventuriers poster
  const moviePosterUrl = "https://upload.wikimedia.org/wikipedia/en/1/16/Les_Aventuriers.png";

  // Before and after website HTML
  const websiteCode = {
    before: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>StreamFlix - Les Aventuriers (1967)</title>
  <script>
    function showPrerollAd() {
      const popup = document.getElementById('adPopup');
      popup.style.display = 'flex';
      let timeLeft = 30;
      const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft === 0) {
          clearInterval(timer);
          document.getElementById('playBtn').disabled = false;
          document.getElementById('timer-text').innerHTML = 'You can now play the video';
        }
      }, 1000);
    }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .movie-card {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .movie-poster {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
    .movie-info { padding: 24px; }
    .movie-title { 
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .movie-meta {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .play-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .play-btn:hover { background: #1d4ed8; }
    .play-btn:disabled { 
      background: #475569;
      cursor: not-allowed;
    }
    .popup-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      justify-content: center;
      align-items: center;
      z-index: 50;
    }
    .popup-content {
      background: #1e293b;
      padding: 24px;
      border-radius: 12px;
      width: 90%;
      max-width: 480px;
      text-align: center;
    }
    .ad-space {
      background: #334155;
      padding: 20px;
      margin: 16px 0;
      border-radius: 8px;
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
    }
    .timer-text {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="movie-card">
      <img 
        src="${moviePosterUrl}"
        alt="Les Aventuriers Movie Poster"
        class="movie-poster"
      >
      <div class="movie-info">
        <h1 class="movie-title">Les Aventuriers (The Last Adventure)</h1>
        <div class="movie-meta">
          1967 • Adventure • 1h 50m • HD
        </div>
        <button class="play-btn" onclick="showPrerollAd()">
          ▶ Play Now
        </button>
      </div>
    </div>
  </div>

  <div id="adPopup" class="popup-overlay">
    <div class="popup-content">
      <h3>Before You Watch</h3>
      <div class="ad-space">
        Advertisement
        <br>
        (30 second wait required)
      </div>
      <p id="timer-text" class="timer-text">
        Please wait <span id="timer">30</span> seconds...
      </p>
      <button id="playBtn" class="play-btn" disabled>
        Continue to Video
      </button>
    </div>
  </div>
</body>
</html>`,

    after: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>StreamFlix - Les Aventuriers (1967)</title>
  <script>
    // Mock HotLabel SDK
    window.HotLabel = {
      init: function(config) {
        console.log('HotLabel initialized:', config);
      },
      onTaskComplete: function(callback) {
        const taskModal = document.createElement('div');
        taskModal.innerHTML = \`
          <div id="hotlabelTask" class="popup-overlay" style="display: flex;">
            <div class="popup-content">
              <h3 class="task-title">Quick Task Before Playing</h3>
              <div class="task-container">
                <div class="task-description">
                  Help improve AI by analyzing this expression
                </div>
                <div class="task-image">
                  <img src="https://i.pinimg.com/736x/c6/fa/f9/c6faf98c4385d683b8ce143273bd933e.jpg" 
                       alt="Intense Expression"
                       style="width: 100%; border-radius: 8px; object-fit: cover; height: 200px;">
                </div>
                <div class="task-question">
                  What emotion best describes this expression?
                </div>
                <div class="task-options">
                  <button onclick="completeTask('intense')" class="task-btn">Intense</button>
                  <button onclick="completeTask('determined')" class="task-btn">Determined</button>
                  <button onclick="completeTask('serious')" class="task-btn">Serious</button>
                </div>
              </div>
            </div>
          </div>
        \`;
        document.body.appendChild(taskModal);

        window.completeTask = function(answer) {
          document.getElementById('hotlabelTask').remove();
          const player = document.createElement('div');
          player.innerHTML = \`
            <div class="video-player">
              <div class="player-overlay">
                ▶ Video playing... (Demo)
              </div>
            </div>
          \`;
          document.querySelector('.movie-card').appendChild(player);
          callback();
        }
      }
    };

    window.HotLabel.init({
      publisherId: "demo-publisher",
      taskType: "pre-action"
    });

    function startVideo() {
      window.HotLabel.onTaskComplete(() => {
        console.log('Video started after task completion');
      });
    }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .movie-card {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .movie-poster {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
    .movie-info { padding: 24px; }
    .movie-title { 
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .movie-meta {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .play-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .play-btn:hover { background: #1d4ed8; }
    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 50;
    }
    .popup-content {
      background: #1e293b;
      padding: 24px;
      border-radius: 12px;
      width: 90%;
      max-width: 480px;
    }
    .task-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      text-align: center;
    }
    .task-container {
      background: #334155;
      padding: 20px;
      border-radius: 8px;
    }
    .task-description {
      color: #94a3b8;
      text-align: center;
      margin-bottom: 16px;
    }
    .task-image {
      margin-bottom: 16px;
    }
    .task-question {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
      text-align: center;
    }
    .task-options {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .task-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .task-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
    .video-player {
      background: #0f172a;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .player-overlay {
      color: #94a3b8;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="movie-card">
      <img 
        src="${moviePosterUrl}"
        alt="Les Aventuriers Movie Poster"
        class="movie-poster"
      >
      <div class="movie-info">
        <h1 class="movie-title">Les Aventuriers (The Last Adventure)</h1>
        <div class="movie-meta">
          1967 • Adventure • 1h 50m • HD
        </div>
        <button 
          class="play-btn"
          onclick="startVideo()"
          data-hotlabel="play">
          ▶ Play Now
        </button>
      </div>
    </div>
  </div>
</body>
</html>`
  };
  
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

  // Initial code templates
  const [beforeCode, setBeforeCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <title>StreamFlix - Les Aventuriers (1967)</title>
  <script>
    function showPrerollAd() {
      const popup = document.getElementById('adPopup');
      popup.style.display = 'flex';
      let timeLeft = 30;
      const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft === 0) {
          clearInterval(timer);
          document.getElementById('playBtn').disabled = false;
          document.getElementById('timer-text').innerHTML = 'You can now play the video';
        }
      }, 1000);
    }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .movie-card {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .movie-poster {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
    .movie-info { padding: 24px; }
    .movie-title { 
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .movie-meta {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .play-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .play-btn:hover { background: #1d4ed8; }
    .play-btn:disabled { 
      background: #475569;
      cursor: not-allowed;
    }
    .popup-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      justify-content: center;
      align-items: center;
      z-index: 50;
    }
    .popup-content {
      background: #1e293b;
      padding: 24px;
      border-radius: 12px;
      width: 90%;
      max-width: 480px;
      text-align: center;
    }
    .ad-space {
      background: #334155;
      padding: 20px;
      margin: 16px 0;
      border-radius: 8px;
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
    }
    .timer-text {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="movie-card">
      <img 
        src="${moviePosterUrl}"
        alt="Les Aventuriers Movie Poster"
        class="movie-poster"
      >
      <div class="movie-info">
        <h1 class="movie-title">Les Aventuriers (The Last Adventure)</h1>
        <div class="movie-meta">
          1967 • Adventure • 1h 50m • HD
        </div>
        <button class="play-btn" onclick="showPrerollAd()">
          ▶ Play Now
        </button>
      </div>
    </div>
  </div>

  <div id="adPopup" class="popup-overlay">
    <div class="popup-content">
      <h3>Before You Watch</h3>
      <div class="ad-space">
        Advertisement
        <br>
        (30 second wait required)
      </div>
      <p id="timer-text" class="timer-text">
        Please wait <span id="timer">30</span> seconds...
      </p>
      <button id="playBtn" class="play-btn" disabled>
        Continue to Video
      </button>
    </div>
  </div>
</body>
</html>`);

  const [afterCode, setAfterCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <title>StreamFlix - Les Aventuriers (1967)</title>
  <script>
    // Mock HotLabel SDK
    window.HotLabel = {
      init: function(config) {
        console.log('HotLabel initialized:', config);
      },
      onTaskComplete: function(callback) {
        const taskModal = document.createElement('div');
        taskModal.innerHTML = \`
          <div id="hotlabelTask" class="popup-overlay" style="display: flex;">
            <div class="popup-content">
              <h3 class="task-title">Quick Task Before Playing</h3>
              <div class="task-container">
                <div class="task-description">
                  Help improve AI by analyzing this expression
                </div>
                <div class="task-image">
                  <img src="https://i.pinimg.com/736x/c6/fa/f9/c6faf98c4385d683b8ce143273bd933e.jpg" 
                       alt="Intense Expression"
                       style="width: 100%; border-radius: 8px; object-fit: cover; height: 200px;">
                </div>
                <div class="task-question">
                  What emotion best describes this expression?
                </div>
                <div class="task-options">
                  <button onclick="completeTask('intense')" class="task-btn">Intense</button>
                  <button onclick="completeTask('determined')" class="task-btn">Determined</button>
                  <button onclick="completeTask('serious')" class="task-btn">Serious</button>
                </div>
              </div>
            </div>
          </div>
        \`;
        document.body.appendChild(taskModal);

        window.completeTask = function(answer) {
          document.getElementById('hotlabelTask').remove();
          const player = document.createElement('div');
          player.innerHTML = \`
            <div class="video-player">
              <div class="player-overlay">
                ▶ Video playing... (Demo)
              </div>
            </div>
          \`;
          document.querySelector('.movie-card').appendChild(player);
          callback();
        }
      }
    };

    window.HotLabel.init({
      publisherId: "demo-publisher",
      taskType: "pre-action"
    });

    function startVideo() {
      window.HotLabel.onTaskComplete(() => {
        console.log('Video started after task completion');
      });
    }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .movie-card {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .movie-poster {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
    .movie-info { padding: 24px; }
    .movie-title { 
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .movie-meta {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .play-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .play-btn:hover { background: #1d4ed8; }
    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 50;
    }
    .popup-content {
      background: #1e293b;
      padding: 24px;
      border-radius: 12px;
      width: 90%;
      max-width: 480px;
    }
    .task-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      text-align: center;
    }
    .task-container {
      background: #334155;
      padding: 20px;
      border-radius: 8px;
    }
    .task-description {
      color: #94a3b8;
      text-align: center;
      margin-bottom: 16px;
    }
    .task-image {
      margin-bottom: 16px;
    }
    .task-question {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
      text-align: center;
    }
    .task-options {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .task-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .task-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
    .video-player {
      background: #0f172a;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .player-overlay {
      color: #94a3b8;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="movie-card">
      <img 
        src="${moviePosterUrl}"
        alt="Les Aventuriers Movie Poster"
        class="movie-poster"
      >
      <div class="movie-info">
        <h1 class="movie-title">Les Aventuriers (The Last Adventure)</h1>
        <div class="movie-meta">
          1967 • Adventure • 1h 50m • HD
        </div>
        <button 
          class="play-btn"
          onclick="startVideo()"
          data-hotlabel="play">
          ▶ Play Now
        </button>
      </div>
    </div>
  </div>
</body>
</html>`);

  // Function to create preview iframe
  const createPreview = (code: string) => {
    return `
      <html>
        <head>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; }
          </style>
        </head>
        <body>${code}</body>
      </html>
    `;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Interactive Implementation Demo</h2>
        <p className="text-muted-foreground">
          See how HotLabel replaces intrusive ads with engaging AI tasks on streaming platforms
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traditional Implementation */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="destructive" className="mb-2">Traditional Popup Ads</Badge>
                <h3 className="text-2xl font-semibold">30-Second Forced Ad Wait</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Current Industry Standard
              </div>
            </div>
          </div>
          
          {/* Taller code editor */}
          <div className="h-[700px] border-b">
            <Editor
              height="700px"
              defaultLanguage="html"
              value={beforeCode}
              onChange={(value) => setBeforeCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 1.6,
                padding: { top: 20 },
              }}
            />
          </div>
          
          {/* Taller preview */}
          <div className="h-[900px] bg-[#0f172a]">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-900">
              <h4 className="font-medium">Live Preview</h4>
            </div>
            <iframe
              title="Before Preview"
              srcDoc={createPreview(beforeCode)}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-popups"
            />
          </div>
        </Card>

        {/* HotLabel Implementation */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="success" className="mb-2">HotLabel AI Tasks</Badge>
                <h3 className="text-2xl font-semibold">Engaging User Experience</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Modern Alternative
              </div>
            </div>
          </div>
          
          {/* Taller code editor */}
          <div className="h-[700px] border-b">
            <Editor
              height="700px"
              defaultLanguage="html"
              value={afterCode}
              onChange={(value) => setAfterCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 1.6,
                padding: { top: 20 },
              }}
            />
          </div>
          
          {/* Taller preview */}
          <div className="h-[900px] bg-[#0f172a]">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-900">
              <h4 className="font-medium">Live Preview</h4>
            </div>
            <iframe
              title="After Preview"
              srcDoc={createPreview(afterCode)}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-popups"
            />
          </div>
        </Card>
      </div>

      {/* Implementation Guide */}
      <Card className="mt-6">
        <div className="p-8">
          <h3 className="text-2xl font-semibold mb-8">Quick Implementation Guide</h3>
          <div className="grid grid-cols-3 gap-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">1</div>
                <div className="font-medium text-lg">Add SDK</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {`<script src="https://cdn.hotlabel.ai/sdk/v1/hotlabel.min.js"></script>`}
                </pre>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">2</div>
                <div className="font-medium text-lg">Initialize</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {`window.HotLabel.init({
  publisherId: "your-id",
  taskType: "pre-action"
});`}
                </pre>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">3</div>
                <div className="font-medium text-lg">Add to Button</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {`<button 
  data-hotlabel="play"
  onclick="startVideo()">
  Play Now
</button>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Add these styles to your global CSS or component
const additionalStyles = `
  .monaco-editor {
    padding-top: 12px;
  }
  
  .iframe-preview {
    background: #0f172a;
  }
`;

export default IntegrationTimerDemo;