import { useState } from "react"
import { loginUser } from "../api"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    const res = await loginUser(email, password)
    if (res.token) {
      localStorage.setItem("token", res.token)
      navigate("/")
    } else {
      alert("Login failed")
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto mt-16 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input placeholder="Email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" className="input mt-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn mt-4" onClick={handleLogin}>Login</button>
    </div>
  )
}
