import { useState } from "react"
import { signupUser } from "../api"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  const handleSignup = async () => {
    const res = await signupUser(email, password, username)
    if (res.user) {
      navigate("/login")
    } else {
      alert("Signup failed")
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto mt-16 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <input placeholder="Username" className="input" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" className="input mt-2" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" className="input mt-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn mt-4" onClick={handleSignup}>Signup</button>
    </div>
  )
}
