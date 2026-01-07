import axios from "axios";

export const API = axios.create({ 
  baseURL: "http://localhost:3001/api",
  timeout: 10000
});

export const getStats = () => API.get("/stats").then(r => r.data);