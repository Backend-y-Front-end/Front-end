import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Flame, ArrowRight, Loader2 } from "lucide-react";

const Home = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const telefono = e.target.telefono.value;
    const password = e.target.password.value;

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
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 text-[200px] opacity-5 animate-float">🪵</div>
          <div className="absolute top-40 -right-10 text-[150px] opacity-5 animate-float" style={{ animationDelay: '1s' }}>🔥</div>
          <div className="absolute bottom-20 left-1/4 text-[100px] opacity-5 animate-float" style={{ animationDelay: '2s' }}>🍞</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texto principal */}
            <div className="text-center md:text-left animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
                <Flame size={16} />
                <span className="text-sm font-bold">Sabor Artesanal</span>
              </div>
              
              <h1 
                className="text-4xl md:text-6xl font-black mb-6 leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Los mejores{" "}
                <span style={{ background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Leños Rellenos
                </span>
                {" "}de la región
              </h1>
              
              <p 
                className="text-lg md:text-xl mb-8"
                style={{ color: 'var(--text-muted)' }}
              >
                Tradición y sabor en cada mordida. Hechos con ingredientes frescos y recetas de familia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
                  style={{ 
                    background: 'var(--gradient-fire)',
                    boxShadow: '0 8px 30px rgba(196, 92, 38, 0.4)'
                  }}
                >
                  Ver Menú
                  <ArrowRight size={20} />
                </Link>
                
                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105"
                    style={{ 
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      border: '2px solid var(--border)'
                    }}
                  >
                    Crear Cuenta
                  </Link>
                )}
              </div>
            </div>

            {/* Formulario de Login */}
            {!user && (
              <div 
                className="animate-fadeIn"
                style={{ animationDelay: '0.2s' }}
              >
                <form
                  onSubmit={handleLogin}
                  className="p-8 rounded-3xl"
                  style={{ 
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🔥</div>
                    <h2 
                      className="text-xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Iniciar Sesión
                    </h2>
                  </div>

                  {error && (
                    <div 
                      className="p-3 rounded-xl text-center text-sm font-medium mb-4"
                      style={{ background: 'var(--error)', color: 'white' }}
                    >
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <input
                      type="tel"
                      name="telefono"
                      placeholder="Teléfono"
                      required
                      className="w-full px-4 py-3 rounded-xl font-medium outline-none transition-all"
                      style={{ 
                        background: 'var(--bg-input)',
                        border: '2px solid var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      required
                      className="w-full px-4 py-3 rounded-xl font-medium outline-none transition-all"
                      style={{ 
                        background: 'var(--bg-input)',
                        border: '2px solid var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{ background: 'var(--gradient-fire)' }}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Iniciar Sesión"}
                  </button>

                  <p 
                    className="text-center mt-4 text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ¿No tienes cuenta?{" "}
                    <Link 
                      to="/register" 
                      className="font-bold hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      Regístrate
                    </Link>
                  </p>
                </form>
              </div>
            )}

            {/* Si ya está logueado */}
            {user && (
              <div 
                className="text-center p-8 rounded-3xl animate-fadeIn"
                style={{ 
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div className="text-6xl mb-4">👋</div>
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ¡Hola, {user.nombre?.split(" ")[0]}!
                </h2>
                <p style={{ color: 'var(--text-muted)' }} className="mb-6">
                  ¿Listo para ordenar?
                </p>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
                  style={{ background: 'var(--gradient-fire)' }}
                >
                  Ir al Menú
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div 
        className="py-16"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🪵", title: "100% Artesanal", desc: "Preparados con recetas tradicionales" },
              { icon: "🔥", title: "Siempre Frescos", desc: "Hechos al momento para ti" },
              { icon: "🚴", title: "Envío Rápido", desc: "Entrega de 7am a 2pm" }
            ].map((item, i) => (
              <div 
                key={i}
                className="text-center p-8 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow)' }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;