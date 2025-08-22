import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAIN_SERVER_URL,
  withCredentials: true, 
});

export default api;