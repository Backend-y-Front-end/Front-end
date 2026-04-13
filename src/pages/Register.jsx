import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import clienteAxios from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
    confirmarPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await clienteAxios.post("/api/users/register", {
        nombre: formData.nombre,
        telefono: formData.telefono,
        correo: formData.correo,
        password: formData.password,
      });

      await login({ telefono: formData.telefono, password: formData.password });
      navigate("/menu");
    } catch (error) {
      setError(error.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--bg-input)',
    border: '2px solid var(--border)',
    color: 'var(--text-primary)'
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 py-8"
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
        {/* Header */}
        <div 
          className="p-8 text-center"
          style={{ background: 'var(--gradient-wood)' }}
        >
          <div className="text-6xl mb-4 animate-float">🔥</div>
          <h1 className="text-2xl font-bold text-white mb-2">Únete a nosotros</h1>
          <p className="text-white/70">Crea tu cuenta en segundos</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div 
              className="p-4 rounded-xl text-center font-medium animate-fadeIn"
              style={{ background: 'var(--error)', color: 'white' }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl font-medium outline-none"
              style={inputStyle}
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl font-medium outline-none"
              style={inputStyle}
              placeholder="6141234567"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl font-medium outline-none"
              style={inputStyle}
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl font-medium outline-none pr-12"
                style={inputStyle}
                placeholder="Mínimo 6 caracteres"
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

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl font-medium outline-none"
              style={inputStyle}
              placeholder="Repite tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
            style={{ 
              background: 'var(--gradient-fire)',
              boxShadow: '0 4px 20px rgba(196, 92, 38, 0.4)'
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <UserPlus size={20} />
                Crear Cuenta
              </>
            )}
          </button>

          <div 
            className="text-center pt-4"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            ¿Ya tienes cuenta?{" "}
            <Link 
              to="/login" 
              className="font-bold hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;