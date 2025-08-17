// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Todo from "./pages/Todo";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogin = () => {
    window.location.href = "/todo"
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/todo" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/todo"
          element={isAuthenticated ? <Todo /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
