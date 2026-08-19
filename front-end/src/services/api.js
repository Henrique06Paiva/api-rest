import axios from "axios";

// Configuração centralizada do Axios para se comunicar com o Back-end
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
