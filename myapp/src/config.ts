const rawUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!rawUrl) {
  throw new Error("EXPO_PUBLIC_API_URL is not set. Add it to your .env file.");
}

export const API_URL: string = rawUrl.replace(/\/+$/, "");
