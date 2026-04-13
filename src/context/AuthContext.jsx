import { createContext, useState, useEffect } from "react";
import clienteAxios from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const token = localStorage.getItem("token");
        const usuarioGuardado = localStorage.getItem("user");
        
        console.log("🔄 Cargando sesión...");
        console.log("🔑 Token en storage:", token ? "Existe" : "No existe");
        console.log("👤 Usuario en storage:", usuarioGuardado);

        if (token && usuarioGuardado) {
          const userData = JSON.parse(usuarioGuardado);
          console.log("✅ Usuario cargado:", userData);
          console.log("🎭 Rol del usuario:", userData.rol);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error al parsear usuario del localStorage:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  const login = async (datos) => {
    try {
      console.log("🔐 Intentando login con:", datos);
      const respuesta = await clienteAxios.post("/api/users/login", datos);
      
      console.log("✅ Respuesta del servidor:", respuesta.data);
      
      // Guardar token
      if (respuesta.data.token) {
        localStorage.setItem("token", respuesta.data.token);
        console.log("💾 Token guardado:", respuesta.data.token.substring(0, 20) + "...");
      } else {
        console.error("❌ El servidor no devolvió un token!");
      }
      
      // Guardar usuario
      if (respuesta.data.user) {
        localStorage.setItem("user", JSON.stringify(respuesta.data.user));
        setUser(respuesta.data.user);
        console.log("👤 Usuario guardado:", respuesta.data.user);
        console.log("🎭 Rol:", respuesta.data.user.rol);
      }
      
      return respuesta.data;
    } catch (error) {
      console.error("❌ Error en login:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  // Función para verificar si el usuario es admin
  const isAdmin = () => {
    return user?.rol === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;