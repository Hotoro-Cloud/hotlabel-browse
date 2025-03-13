import React from "react";

/**
 * Component to inject animation styles globally
 */
const AnimationStyles = () => (
  <style jsx global>{`
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
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .animate-scale-in {
      animation: scale-in 0.3s ease-out forwards;
    }
    
    .animate-scale-out {
      animation: scale-out 0.3s ease-in forwards;
    }
    
    .animate-pulse-subtle {
      animation: pulse 2s ease-in-out infinite;
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `}</style>
);

export default AnimationStyles;