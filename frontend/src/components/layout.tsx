import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-indigo-600 text-white">
        <Link to="/" className="text-2xl font-bold hover:underline">
          Assigny
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
