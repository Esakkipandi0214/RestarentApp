// src/components/UI/FoodLoader.tsx
// import React from "react";

const FoodLoader = () => {
  return (
    // Fullscreen overlay with semi-transparent background
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Burger animation */}
      <div className="relative w-16 h-16 animate-bounce">
        <div className="w-16 h-3 rounded-t-xl bg-yellow-400 mb-1"></div> {/* top bun */}
        <div className="w-16 h-2 rounded bg-green-300 mb-1"></div> {/* lettuce */}
        <div className="w-16 h-3 rounded bg-orange-700 mb-1"></div> {/* patty */}
        <div className="w-16 h-3 rounded-b-xl bg-yellow-500"></div> {/* bottom bun */}
      </div>
      <p className="text-gray-200 font-semibold text-lg text-center mt-4">
        Preparing your delicious content...
      </p>
    </div>
  );
};

export default FoodLoader;
