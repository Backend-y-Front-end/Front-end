import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Phone, LogOut, ArrowLeft, Shield } from "lucide-react";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <p style={{ color: 'var(--text-muted)' }}>Cargando perfil...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-md mx-auto">
        <div 
          className="rounded-2xl overflow-hidden animate-fadeIn"
          style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}
        >
          {/* Header */}
          <div 
            className="p-8 text-center"
            style={{ background: 'var(--gradient-wood)' }}
          >
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-black text-white"
              style={{ background: 'var(--accent)' }}
            >
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 className="text-2xl font-bold text-white">{user.nombre}</h2>
            <span 
              className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              <Shield size={14} />
              {user.rol}
            </span>
          </div>

          {/* Detalles */}
          <div className="p-6 space-y-4">
            <div 
              className="p-4 rounded-xl flex items-center gap-4"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Teléfono</p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.telefono}</p>
              </div>
            </div>

            {user.correo && (
              <div 
                className="p-4 rounded-xl flex items-center gap-4"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Correo</p>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.correo}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              style={{ background: 'var(--error)', color: 'white' }}
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 font-bold flex items-center justify-center gap-2"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={18} />
              Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;