import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
