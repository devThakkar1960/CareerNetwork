import React from 'react';
import ComponentA from './componentA';
import ComponentB from './componentB';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate("/");
    window.location.reload(); // Refresh to reset state
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="text-xl font-bold p-4 border-b border-gray-700">
          Admin Sidebar
        </div>
        <ComponentA />
        <ComponentB />
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 text-white m-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the Admin Panel</h1>
        {/* Your main content */}
      </main>
    </div>
  );
}

export default AdminPanel;
