import { useState, useEffect } from "react";
import { signupUser, getDepartments } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [level, setLevel] = useState("");
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);

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
      alert("Please fill in all fields");
      return;
    }

    const res = await signupUser(email, password, username, Number(departmentId), level);
    if (res.message === "user added successfully") {
      navigate("/login");
    } else {
      alert(res.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create an Account</h2>

        <div className="space-y-4">
          <input
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            placeholder="Email"
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={departmentId}
            onChange={e => setDepartmentId(Number(e.target.value))}
          >
            <option value="">Select Department</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select>

          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="FIRST">First</option>
            <option value="SECOND">Second</option>
            <option value="THIRD">Third</option>
            <option value="FOURTH">Fourth</option>
          </select>
        </div>

        <button
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
