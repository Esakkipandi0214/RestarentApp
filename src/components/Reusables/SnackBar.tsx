import React, { FC, ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  children: ReactNode; // Allows any React nodes (text, elements, etc.)
  icon?: React.ReactNode; // Optional custom icon
}

const InfoCard: FC<InfoCardProps> = ({ title, children, icon }) => {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 p-6 space-x-4 rounded-md bg-white shadow-lg border border-gray-200 dark:bg-gray-50 dark:text-gray-800 z-50">
      <div className="flex items-center self-stretch justify-center">
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-10 h-10">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default InfoCard;
