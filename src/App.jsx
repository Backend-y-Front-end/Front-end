import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Menu from "./components/Menu";
import MisPedidos from "./components/MisPedidos";
import Checkout from "./components/Checkout";
import AdminDashboard from "./pages/AdminDashboard";

// --- PROTECCIÓN DE RUTAS ---
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  if (!user || user.rol !== "admin") return <Navigate to="/" />;
  return children;
};

const ClienteRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center text-[#5D3A1A]">
        Cargando...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (user.rol === "admin") return <Navigate to="/admin" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* 🏠 PÁGINA PRINCIPAL = CATÁLOGO con carrito (Público) */}
          <Route path="/" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />

          {/* 🔐 AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 🛒 CHECKOUT (Requiere login) */}
          <Route
            path="/checkout"
            element={
              <ClienteRoute>
                <Checkout />
              </ClienteRoute>
            }
          />

          {/* 📋 MIS PEDIDOS (Requiere login) */}
          <Route
            path="/mis-pedidos"
            element={
              <ClienteRoute>
                <MisPedidos />
              </ClienteRoute>
            }
          />

          {/* 👤 PERFIL */}
          <Route
            path="/perfil"
            element={
              <ClienteRoute>
                <Profile />
              </ClienteRoute>
            }
          />

          {/* ⚙️ PANEL DE ADMINISTRADOR */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;