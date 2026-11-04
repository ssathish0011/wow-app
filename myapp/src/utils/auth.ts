import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const isWeb = Platform.OS === "web";

const storage = {
  async set(key: string, value: string): Promise<void> {
    if (isWeb) {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async get(key: string): Promise<string | null> {
    if (isWeb) {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem(key)
        : null;
    }
    return await SecureStore.getItemAsync(key);
  },

  async remove(key: string): Promise<void> {
    if (isWeb) {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export interface AuthUser {
  name: string;
  email: string;
  id?: string;
}

export const saveSession = async (
  token: string,
  user: AuthUser
): Promise<void> => {
  await storage.set(TOKEN_KEY, token);
  await storage.set(USER_KEY, JSON.stringify(user));
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await storage.get(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getUser = async (): Promise<AuthUser | null> => {
  try {
    const raw = await storage.get(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const clearSession = async (): Promise<void> => {
  try {
    await storage.remove(TOKEN_KEY);
    await storage.remove(USER_KEY);
  } catch {
    // do nothing on failure
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const getErrorMessage = (error: any): string => {
  if (
    error?.code === "ECONNABORTED" ||
    error?.message?.toLowerCase().includes("timeout")
  ) {
    return "Request timed out. Please check your connection and try again.";
  }

  if (error?.response) {
    const data = error.response.data;
    const status = error.response.status;

    if (data?.message) {
      return data.message;
    }
    if (data?.error) {
      return typeof data.error === "string" ? data.error : "Server error";
    }
    return `Server error (${status})`;
  }

  if (error?.request || error?.message === "Network Error") {
    return "Network error. Please check your internet connection.";
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};
