import { useState, useEffect } from "react";
import clienteAxios from "../api/axios";
import Sidebar from "../components/admin/Sidebar";
import PedidosManager from "../components/admin/PedidosManager";
import InventarioEditor from "../components/admin/InventarioEditor";
import CatalogoStock from "../components/admin/CatalogoStock";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pedidos");
  const [inventario, setInventario] = useState([]);
  const { theme, toggleTheme } = useTheme();

  const fetchInventario = async () => {
    try {
      const res = await clienteAxios.get("/api/products");
      setInventario(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  return (
    <div 
      className="min-h-screen flex"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 
              className="text-2xl md:text-3xl font-black"
              style={{ color: 'var(--text-primary)' }}
            >
              Panel de Administración
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Gestiona tu negocio desde aquí
            </p>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl transition-all hover:scale-110"
            style={{ 
              background: 'var(--bg-card)', 
              color: 'var(--accent)',
              boxShadow: 'var(--shadow)'
            }}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === "pedidos" && <PedidosManager />}

          {activeTab === "catalogo" && (
            <InventarioEditor refresh={fetchInventario} />
          )}

          {activeTab === "stock" && (
            <CatalogoStock productos={inventario} refresh={fetchInventario} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;