// src/components/Services/DeviceGuard.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const DeviceGuard = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (isDesktop === false) {
      // Show message for 2 seconds then redirect
      const timer = setTimeout(() => setRedirect(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isDesktop]);

  if (isDesktop === null) return null; // avoid flicker
  if (redirect) return <Navigate to="/login" replace />;

  return isDesktop ? (
    <Outlet />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-900 text-white text-center p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">Device Not Supported</h1>
        <p className="text-lg">
          This application is only available on desktop screens. Redirecting to login...
        </p>
      </div>
    </div>
  );
};

export default DeviceGuard;
