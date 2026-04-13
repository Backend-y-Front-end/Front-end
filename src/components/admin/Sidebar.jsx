import { ShoppingBag, BookOpen, Package, LogOut, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
    { id: "catalogo", label: "Nuevo Producto", icon: BookOpen },
    { id: "stock", label: "Inventario", icon: Package },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-3"
        style={{ 
          background: 'var(--bg-card)', 
          borderTop: '1px solid var(--border)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <div className="flex justify-around items-center">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
              style={{ 
                color: activeTab === item.id ? 'var(--accent)' : 'var(--text-muted)',
                background: activeTab === item.id ? 'var(--accent)20' : 'transparent'
              }}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
          <Link
            to="/"
            className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ color: 'var(--text-muted)' }}
          >
            <Home size={22} />
            <span className="text-[10px] font-bold">Inicio</span>
          </Link>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside 
        className="hidden md:flex flex-col w-64 min-h-screen"
        style={{ 
          background: 'var(--bg-card)', 
          borderRight: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <Link to="/" className="flex items-center gap-3">
            <span className="text-4xl">🪵</span>
            <div>
              <h1 
                className="font-black text-lg"
                style={{ 
                  background: 'var(--gradient-fire)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}
              >
                Leños Rellenos
              </h1>
              <span 
                className="text-xs font-bold"
                style={{ color: 'var(--text-muted)' }}
              >
                Panel Admin
              </span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div 
          className="p-4 mx-4 mt-4 rounded-xl"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: 'var(--accent)' }}
            >
              {user?.nombre?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {user?.nombre || "Admin"}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Administrador
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all"
              style={{ 
                background: activeTab === item.id ? 'var(--accent)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--text-secondary)'
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all"
            style={{ color: 'var(--text-muted)' }}
          >
            <Home size={20} />
            Ir a la Tienda
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all"
            style={{ color: 'var(--error)' }}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;