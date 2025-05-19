import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout"
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Assignments from "./pages/Assignments";
import AddAssignment from './pages/addAssignment';
import AddSubject from './pages/admin/AddSubject';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Assignments />
            </Layout>
          }
        />
        <Route
          path="/add-assignment"
          element={
            <Layout>
              <AddAssignment />
            </Layout>
          }
        />
        <Route
          path="/add-subject"
          element={
            <Layout>
              <AddSubject />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
