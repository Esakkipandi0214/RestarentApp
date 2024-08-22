import { FC } from 'react';
// import { Link } from 'react-router-dom';
import Layout from '../StaticComponents/layout';

const Main: FC = () => {
  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="bg-indigo-600 flex justify-between text-white p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      </header>
      <main className="mt-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Main Dashboard</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Here you can manage your profile, view notifications, and access various features.
          </p>
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default Main;
