// components/Layout.tsx
import React, { Suspense } from 'react';
import Sidebar from './sidebar';
import FoodLoader from '../UI/FoodLoader'; // import your loader
import LoaderWrapper from '../UI/LoaderWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="flex flex-col flex-1 overflow-auto">
        <main className="flex-1 p-6">
          {/* Wrap main content with Suspense */}
          <Suspense fallback={<FoodLoader />}>
          <LoaderWrapper delay={1000}>
            {children} {/* Main content area */}
            </LoaderWrapper>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
