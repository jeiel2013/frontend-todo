import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Todo from "./pages/Todo";
import Register from "./pages/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação no mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Verificando token:", token ? "EXISTE" : "NÃO EXISTE");
    
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    console.log("🚀 Login realizado, atualizando estado");
    setIsAuthenticated(true);
    // Não precisa de redirecionamento manual - o React Router fará automaticamente
  };

  const handleLogout = () => {
    console.log("👋 Logout realizado");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Loading inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  console.log("🎯 Estado atual:", { isAuthenticated });

  return (
    <Router>
      <Routes>
        {/* Rota raiz - redireciona baseado na autenticação */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/todo" : "/login"} replace />}
        />
        
        {/* Rota de registro */}
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
              <Navigate to="/todo" replace /> : 
              <Register />
          }
        />
        
        {/* Rota de login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/todo" replace /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Rota protegida do todo */}
        <Route
          path="/todo"
          element={
            isAuthenticated ? 
              <Todo onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          }
        />
        
        {/* Catch-all - redireciona para home */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;