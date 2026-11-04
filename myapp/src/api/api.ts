import axios from "axios";
import { router } from "expo-router";

import { API_URL } from "../config";
import { clearSession, getToken } from "../utils/auth";

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint =
      url.includes("/login") || url.includes("/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      await clearSession();
      router.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default API;
