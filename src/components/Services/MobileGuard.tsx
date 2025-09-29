// src/components/Services/MobileGuard.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const MobileGuard = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768); // only mobile
    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (isMobile === false) {
      // Show message for 2 seconds then redirect
      const timer = setTimeout(() => setRedirect(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  if (isMobile === null) return null; // avoid flicker
  if (redirect) return <Navigate to="/login" replace />;

  return isMobile ? (
    <Outlet />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-700 via-red-600 to-pink-500 text-white text-center p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">Device Not Supported</h1>
        <p className="text-lg">
          This application is only available on mobile phones. Redirecting to login...
        </p>
      </div>
    </div>
  );
};

export default MobileGuard;
