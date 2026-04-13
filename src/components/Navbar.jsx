import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Menu, X, Sun, Moon, User, LogOut, ShoppingBag, ClipboardList } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav style={{ 
      background: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow)'
    }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-xl"
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="text-3xl">🪵</span>
            <span style={{ background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Leños Rellenos
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/menu" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ShoppingBag size={18} />
              Menú
            </Link>

            {user && (
              <Link 
                to="/mis-pedidos" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ClipboardList size={18} />
                Mis Pedidos
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--accent)' 
              }}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/perfil"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <User size={18} />
                  {user.nombre?.split(" ")[0]}
                </Link>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl transition-all hover:scale-105"
                  style={{ color: 'var(--error)' }}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-6 py-2 rounded-xl font-bold transition-all hover:scale-105"
                style={{ 
                  background: 'var(--gradient-fire)', 
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(196, 92, 38, 0.3)'
                }}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl"
              style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div 
            className="md:hidden py-4 space-y-2 animate-fadeIn"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <Link 
              to="/menu" 
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <ShoppingBag size={20} />
              Ver Menú
            </Link>
            
            {user && (
              <Link 
                to="/mis-pedidos" 
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <ClipboardList size={20} />
                Mis Pedidos
              </Link>
            )}

            {user ? (
              <>
                <Link 
                  to="/perfil"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <User size={20} />
                  Mi Perfil
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'var(--error)', color: 'white' }}
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                onClick={closeMenu}
                className="block text-center px-4 py-3 rounded-xl font-bold"
                style={{ background: 'var(--gradient-fire)', color: 'white' }}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;