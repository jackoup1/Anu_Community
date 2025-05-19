// src/components/Layout.tsx
import {useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens or session here
    localStorage.removeItem("token"); // example
    navigate("/login"); // redirect to login page
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-indigo-600 text-white">
        <h1 className="text-2xl font-bold">Assigny</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </header>
      <main >{children}</main>
    </div>
  );
};

export default Layout;
