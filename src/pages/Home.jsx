import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // MUESTRA LA PÁGINA DE BIENVENIDA CON FORMULARIO DE LOGIN
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
      {/* Imagen de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">🪵</div>
        <div className="absolute bottom-20 right-20 text-9xl">🔥</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10">🍞</div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="text-center mb-8 animate-in fade-in zoom-in duration-700">
          <span className="text-6xl mb-4 block">🪵</span>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            Bienvenidos
          </h1>
          <p className="text-gray-600 text-lg">
            Los mejores sabores artesanales de la región
          </p>
        </div>

        {/* Formulario de Login integrado */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const telefono = e.target.telefono.value;
            const password = e.target.password.value;

            try {
              const res = await login({ telefono, password });
              const nombreUsuario = res?.user?.nombre || "Usuario";
              alert(`¡Hola de nuevo, ${nombreUsuario}! 🔥`);

              if (res?.user?.rol === "admin") {
                navigate("/admin");
              } else {
                navigate("/");
              }
            } catch (error) {
              console.error("Error en login:", error);
              alert(
                error.response?.data?.message ||
                  "Teléfono o contraseña incorrectos",
              );
            }
          }}
          className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border-t-8 border-orange-500 animate-in fade-in zoom-in duration-500"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">
              Iniciar Sesión
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Ingresa tu teléfono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-orange-700 transition-all active:scale-95"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;