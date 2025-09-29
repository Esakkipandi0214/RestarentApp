// components/Layout.tsx
import React, { Suspense } from 'react';
import Sidebar from './sidebar';
import FoodLoader from '../UI/FoodLoader';
import LoaderWrapper from '../UI/LoaderWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}

     className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main
          className="flex-1 p-6 overflow-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Wrap main content with Suspense */}
          <Suspense fallback={<FoodLoader />}>
            <LoaderWrapper delay={1000}>
              <div className="h-full">{children}</div>
            </LoaderWrapper>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
