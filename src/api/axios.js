import axios from "axios";

const clienteAxios = axios.create({
  baseURL: "http://localhost:4000"
});

// Interceptor que añade el token a CADA petición
clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔐 Token enviado:", token ? "Sí" : "No"); // Debug
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401
clienteAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("⚠️ Error 401: Token inválido o no enviado");
      // Opcional: limpiar token y redirigir al login
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default clienteAxios;