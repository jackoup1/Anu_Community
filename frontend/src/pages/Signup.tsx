import { useState, useEffect } from "react";
import { signupUser, getDepartments } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaLevelUpAlt } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [level, setLevel] = useState("");
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    loadDepartments();
  }, []);

  const handleSignup = async () => {
    if (!email || !password || !username || !departmentId || !level) {
      setError("Please fill in all fields.");
      return;
    }

    const res = await signupUser(email, password, username, Number(departmentId), level);
    if (res.message === "user added successfully") {
      navigate("/login");
    } else {
      setError(res.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Create an Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <FaUser className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <FaUniversity className="absolute top-3.5 left-3 text-gray-400" />
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaLevelUpAlt className="absolute top-3.5 left-3 text-gray-400" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Select Level</option>
              <option value="FIRST">First</option>
              <option value="SECOND">Second</option>
              <option value="THIRD">Third</option>
              <option value="FOURTH">Fourth</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSignup}
          className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
