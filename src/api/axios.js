import axios from "axios";

const clienteAxios = axios.create({
  // Escribe la URL de tu backend directamente SIN el /api al final
  baseURL: "https://backend-production-0532.up.railway.app",
});

clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default clienteAxios;
