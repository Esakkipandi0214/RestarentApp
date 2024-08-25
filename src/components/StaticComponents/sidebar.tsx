// components/Sidebar.tsx

import React from 'react';
import RoleServices from '../Services/RoleServices';

const Sidebar: React.FC = () => {

  const navigateTo = (path: string) => {
    window.location.href = path; // Use router.push for navigation
  };

  const handleLogout = () => {
    // Perform logout logic here, e.g., clear session or token
    // Example: Clear local storage or session storage
    localStorage.removeItem('authToken'); // Adjust according to your token storage method
    localStorage.removeItem('CreditorId');
    localStorage.removeItem('Restaurentrole')
    // Redirect to login page or home page after logout
    window.location.href ='/'; // Adjust the path according to your application
  };

  return (
    <div className="flex flex-col p-3 w-60 bg-slate-800 text-white">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <button
            className="p-2"
            aria-label="Toggle Sidebar"
            onClick={() => console.log('Sidebar toggle clicked')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5 fill-current"
            >
              <rect width="352" height="32" x="80" y="96"></rect>
              <rect width="352" height="32" x="80" y="240"></rect>
              <rect width="352" height="32" x="80" y="384"></rect>
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          {RoleServices.isAdmin() && <><button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/dashboard')}
          >
            Dashboard
          </button><button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/Employee-verification')}
          >
              Add Employee
            </button></>}
          {RoleServices.isEmployee() && <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/all-profile')}
          >
            Profile
          </button>}
         {RoleServices.isAdmin() && <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/add-Menu')}
          >
          Add Menu
          </button>}
          {RoleServices.isChef() && <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/view-orders')}
          >
          Order Items
          </button>}
          {RoleServices.isWaiter() && <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/delivery-orders')}
          >
          Delivery Items
          </button>}
          {RoleServices.isAdmin() && <><button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/Billing-orders')}
          >
            Billing Items
          </button><button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigateTo('/History-orders')}
          >
              Orders Mangement
            </button></>}
          <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded bg-red-600 mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
