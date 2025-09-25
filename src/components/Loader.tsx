import React, { useEffect, useState } from "react";

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Simulate loading duration
    const timer = setTimeout(() => {
      setAnimateOut(true);
      // After animation, hide loader
      setTimeout(() => setIsVisible(false), 1000);
    }, 2000); // 2 seconds loading with beating logo

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white z-50 overflow-hidden ${animateOut ? "animate-slide-out" : ""}`}
      style={{ perspective: "1000px" }}
    >
      <div className="w-32 h-32">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain animate-beat" />
      </div>
      <style>{`
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-beat {
          animation: beat 1.5s infinite;
          transform-origin: center;
        }
        @keyframes slideOut {
          0% { transform: translateX(0) rotateY(0deg); opacity: 1; }
          100% { transform: translateX(100%) rotateY(90deg); opacity: 0; }
        }
        .animate-slide-out {
          animation: slideOut 1s forwards;
          transform-origin: left center;
        }
      `}</style>
    </div>
  );
};

export default Loader;
