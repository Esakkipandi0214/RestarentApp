import React, { useState, useEffect } from "react";
import FoodLoader from "./FoodLoader";

interface LoaderWrapperProps {
  children: React.ReactNode;
  delay?: number; // time in milliseconds
}

const LoaderWrapper: React.FC<LoaderWrapperProps> = ({ children, delay = 2000 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return <>{loading ? <FoodLoader /> : children}</>;
};

export default LoaderWrapper;
