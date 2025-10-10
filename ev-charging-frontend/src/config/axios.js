import axios from "axios";

// Set config defaults when creating the instance
const api = axios.create({
  baseURL: 'http://222.255.214.35:8080/api/'
});

export default api;