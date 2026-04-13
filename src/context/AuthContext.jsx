import { createContext, useState, useEffect } from "react";
import clienteAxios from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = () => {
      const token = localStorage.getItem("token");
      const usuarioGuardado = localStorage.getItem("user");

      if (token && usuarioGuardado) {
        try {
          setUser(JSON.parse(usuarioGuardado));
        } catch (error) {
          console.error("Error al parsear usuario del localStorage");
          logout();
        }
      }
      setLoading(false);
    };

    cargarUsuario();
  }, []);

  const login = async (datos) => {
    const respuesta = await clienteAxios.post("/api/users/login", datos);

    localStorage.setItem("token", respuesta.data.token);
    localStorage.setItem("user", JSON.stringify(respuesta.data.user));

    setUser(respuesta.data.user);

    return respuesta.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Redirigir al catálogo en lugar del login
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;