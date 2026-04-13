import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
      setError(
        error.response?.data?.message || "Teléfono o contraseña incorrectos",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B4513] flex items-center justify-center shadow-lg">
            <span className="text-4xl">🪵</span>
          </div>
          <h1 className="text-2xl font-black text-[#5D3A1A] uppercase tracking-wide">
            Bienvenido de vuelta
          </h1>
          <p className="text-[#8B6914] text-sm mt-1">Ingresa para continuar</p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-[#8B4513]"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#5D3A1A] mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#E8D5B7] rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-all bg-[#FFFDF7]"
                placeholder="Ej: 6141234567"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D3A1A] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#E8D5B7] rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-all pr-12 bg-[#FFFDF7]"
                  placeholder="Tu contraseña"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B4513] text-white py-4 rounded-xl font-bold uppercase tracking-wide shadow-lg hover:bg-[#6B3410] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-[#8B4513] text-sm font-medium hover:text-[#5D3A1A] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        <p className="text-center mt-6 text-[#7A6B5A]">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-[#8B4513] font-bold hover:text-[#5D3A1A]"
          >
            Regístrate aquí
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

export default Login;