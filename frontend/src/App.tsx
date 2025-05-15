import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Assignments from "./pages/Assignments"
import AddAssignment from './pages/addAssignment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Assignments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-assignment" element={<AddAssignment />} />
      </Routes>
    </Router>
  )
}

export default App
