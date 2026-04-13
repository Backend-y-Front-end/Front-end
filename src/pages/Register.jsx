import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B4513] flex items-center justify-center shadow-lg">
            <span className="text-4xl">🪵</span>
          </div>
          <h1 className="text-2xl font-black text-[#5D3A1A] uppercase tracking-wide">
            Únete a nosotros
          </h1>
          <p className="text-[#8B6914] text-sm mt-1">
            Crea tu cuenta en segundos
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-[#8B4513]"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#5D3A1A] mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#E8D5B7] rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-all bg-[#FFFDF7]"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D3A1A] mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#E8D5B7] rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-all bg-[#FFFDF7]"
                placeholder="Ej: 6141234567"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D3A1A] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#E8D5B7] rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-all bg-[#FFFDF7]"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D3A1A] mb-2">
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
                  className="w-full px-4 py-3 border-2 border-[#E8D5B7] rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-all pr-12 bg-[#FFFDF7]"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#8B6914] hover:text-[#5D3A1A]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D3A1A] mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#E8D5B7] rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-all bg-[#FFFDF7]"
                placeholder="Repite tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B4513] text-white py-4 rounded-xl font-bold uppercase tracking-wide shadow-lg hover:bg-[#6B3410] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-[#7A6B5A]">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-[#8B4513] font-bold hover:text-[#5D3A1A]"
          >
            Inicia sesión
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center mt-4 text-[#8B6914] text-sm hover:text-[#5D3A1A]"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
};

export default Register;