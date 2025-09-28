// components/Sidebar.tsx

import React from 'react';
import RoleServices from '../Services/RoleServices';
import {Link} from 'react-router-dom';

const Sidebar: React.FC = () => {

  // const navigateTo = (path: string) => {
  //   window.location.href = path; // Use router.push for navigation
  // };

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
  {RoleServices.isAdmin() && (
    <>
      <Link
        to="/dashboard"
        className="block w-full text-left p-2 rounded hover:bg-gray-700"
      >
        Dashboard
      </Link>

      <Link
        to="/Employee-verification"
        className="block w-full text-left p-2 rounded hover:bg-gray-700"
      >
        Add Employee
      </Link>
    </>
  )}

  {RoleServices.isEmployee() && (
    <Link
      to="/all-profile"
      className="block w-full text-left p-2 rounded hover:bg-gray-700"
    >
      Profile
    </Link>
  )}

  {RoleServices.isAdmin() && (
    <Link
      to="/add-Menu"
      className="block w-full text-left p-2 rounded hover:bg-gray-700"
    >
      Add Menu
    </Link>
  )}

  {RoleServices.isChef() && (
    <Link
      to="/view-orders"
      className="block w-full text-left p-2 rounded hover:bg-gray-700"
    >
      Order Items
    </Link>
  )}

  {RoleServices.isWaiter() && (
    <Link
      to="/delivery-orders"
      className="block w-full text-left p-2 rounded hover:bg-gray-700"
    >
      Delivery Items
    </Link>
  )}

  {RoleServices.isAdmin() && (
    <>
      <Link
        to="/Billing-orders"
        className="block w-full text-left p-2 rounded hover:bg-gray-700"
      >
        Billing Items
      </Link>

      <Link
        to="/History-orders"
        className="block w-full text-left p-2 rounded hover:bg-gray-700"
      >
        Orders Management
      </Link>
    </>
  )}

  <button
    onClick={handleLogout}
    className="block w-full text-left p-2 rounded bg-red-600 hover:bg-red-700 mt-4"
  >
    Logout
  </button>
</nav>

      </div>
    </div>
  );
};

export default Sidebar;
