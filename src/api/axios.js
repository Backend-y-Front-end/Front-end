import axios from "axios";

const clienteAxios = axios.create({
  baseURL: "http://localhost:4000"
});

clienteAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default clienteAxios;