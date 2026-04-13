import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-[#FDF6E3] shadow-md border-b-2 border-[#8B4513] py-4 px-6 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🪵</span>
          <span className="font-black text-xl text-[#5D3A1A] tracking-tighter uppercase">
            Leños <span className="text-[#8B4513]">Rellenos</span>
          </span>
        </Link>

        {/* Menú Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/menu"
            className="text-[#5D3A1A] font-semibold hover:text-[#8B4513] transition"
          >
            Catálogo
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/perfil"
                className="flex items-center space-x-2 bg-[#F5E6D3] px-3 py-1 rounded-full border border-[#D4A574] hover:bg-[#E8D5B7] transition"
              >
                <span className="text-[#8B4513] font-bold">
                  👤 {user?.nombre ? user.nombre.split(" ")[0] : "Usuario"}
                </span>
              </Link>

              {user?.rol === "admin" && (
                <Link
                  to="/admin"
                  className="text-xs font-black text-[#8B4513] border-b-2 border-[#8B4513] hover:text-[#5D3A1A] transition"
                >
                  GESTIÓN
                </Link>
              )}

              <button
                onClick={onLogout}
                className="bg-[#8B4513] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#6B3410] shadow-md transition active:scale-95"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-[#5D3A1A] font-bold hover:text-[#8B4513] transition"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-[#8B4513] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#6B3410] transition shadow-lg active:scale-95"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Botón Hamburguesa (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#5D3A1A] p-2 hover:bg-[#E8D5B7] rounded-lg transition"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#E8D5B7] animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            <Link
              to="/menu"
              onClick={closeMenu}
              className="text-[#5D3A1A] font-semibold hover:text-[#8B4513] py-2 px-3 rounded-lg hover:bg-[#F5E6D3] transition"
            >
              🪵 Catálogo
            </Link>

            {user ? (
              <>
                <Link
                  to="/checkout"
                  onClick={closeMenu}
                  className="text-[#5D3A1A] font-semibold hover:text-[#8B4513] py-2 px-3 rounded-lg hover:bg-[#F5E6D3] transition"
                >
                  🛒 Carrito
                </Link>

                <Link
                  to="/mis-pedidos"
                  onClick={closeMenu}
                  className="text-[#5D3A1A] font-semibold hover:text-[#8B4513] py-2 px-3 rounded-lg hover:bg-[#F5E6D3] transition"
                >
                  📋 Mis Pedidos
                </Link>

                <Link
                  to="/perfil"
                  onClick={closeMenu}
                  className="text-[#5D3A1A] font-semibold hover:text-[#8B4513] py-2 px-3 rounded-lg hover:bg-[#F5E6D3] transition"
                >
                  👤 Mi Perfil
                </Link>

                {user?.rol === "admin" && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="text-[#8B4513] font-black py-2 px-3 rounded-lg bg-[#F5E6D3] transition"
                  >
                    ⚙️ Panel Admin
                  </Link>
                )}

                <button
                  onClick={onLogout}
                  className="bg-[#8B4513] text-white py-3 px-4 rounded-lg font-bold text-sm hover:bg-[#6B3410] shadow-md transition active:scale-95 mt-2"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-[#5D3A1A] font-bold hover:text-[#8B4513] py-2 px-3 rounded-lg hover:bg-[#F5E6D3] transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="bg-[#8B4513] text-white py-3 px-4 rounded-lg font-bold text-center hover:bg-[#6B3410] transition shadow-lg active:scale-95"
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;