import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, Loader2, Flame } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ telefono, password });
      if (res?.user?.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Teléfono o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div 
        className="w-full max-w-md animate-fadeIn"
        style={{ 
          background: 'var(--bg-card)', 
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
      >
        {/* Header con gradiente */}
        <div 
          className="p-8 text-center"
          style={{ background: 'var(--gradient-wood)' }}
        >
          <div className="text-6xl mb-4 animate-float">🪵</div>
          <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-white/70">Ingresa para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div 
              className="p-4 rounded-xl text-center font-medium animate-fadeIn"
              style={{ background: 'var(--error)', color: 'white' }}
            >
              {error}
            </div>
          )}

          <div>
            <label 
              className="block text-sm font-bold mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Teléfono
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl font-medium transition-all outline-none"
              style={{ 
                background: 'var(--bg-input)', 
                border: '2px solid var(--border)',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              placeholder="Ej: 6141234567"
            />
          </div>

          <div>
            <label 
              className="block text-sm font-bold mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl font-medium transition-all outline-none pr-12"
                style={{ 
                  background: 'var(--bg-input)', 
                  border: '2px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ 
              background: 'var(--gradient-fire)',
              boxShadow: '0 4px 20px rgba(196, 92, 38, 0.4)'
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Flame size={20} />
                Iniciar Sesión
              </>
            )}
          </button>

          <Link 
            to="/recuperar" 
            className="block text-center font-semibold hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <div 
            className="text-center pt-4"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            ¿No tienes cuenta?{" "}
            <Link 
              to="/register" 
              className="font-bold hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;