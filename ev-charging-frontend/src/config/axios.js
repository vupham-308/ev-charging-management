import axios from "axios";

// Set config defaults when creating the instance
const api = axios.create({
  baseURL: 'http://222.255.214.35:8080/api/'
});


// Thêm interceptor để tự động thêm header Authorization vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;