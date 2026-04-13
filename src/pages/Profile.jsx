import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center mt-20 text-orange-600 font-bold">
        Cargando perfil...
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden mt-10">
        {/* Encabezado */}
        <div className="bg-orange-600 p-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-4xl font-bold border-4 border-white shadow-lg">
            {user.nombre ? user.nombre.charAt(0) : "U"}
          </div>
          <h2 className="text-white text-2xl font-bold mt-4">{user.nombre}</h2>
          <span className="bg-orange-800 text-orange-100 text-xs px-3 py-1 rounded-full uppercase tracking-widest mt-2">
            {user.rol}
          </span>
        </div>

        {/* Detalles */}
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4 border-b pb-4 border-gray-100">
            <div className="bg-gray-100 p-3 rounded-xl">📱</div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">
                Teléfono
              </p>
              <p className="text-gray-800 font-semibold">{user.telefono}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 text-orange-600 font-semibold hover:underline"
      >
        ← Volver al Catálogo
      </button>
    </div>
  );
};

export default Profile;
