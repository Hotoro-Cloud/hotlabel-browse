import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import IntegrationTimerDemo from "@/components/IntegrationTimerDemo";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnimationStyles from "@/components/AnimationStyles";

const IntegrationTimer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimationStyles />
      <AnimatedBackground />
      
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg">H</div>
            <h1 className="text-xl font-semibold">HotLabel</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg p-6">
            <IntegrationTimerDemo />
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HotLabel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IntegrationTimer;