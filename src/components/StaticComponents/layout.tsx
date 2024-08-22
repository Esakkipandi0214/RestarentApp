// components/Layout.tsx

import React from 'react';
// import Header from './header';
import Sidebar from './sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className=" flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="flex flex-col flex-1 overflow-auto">
        <main className="flex-1 p-6">
          {children} {/* Main content area */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
