import {jwtDecode} from "jwt-decode";

export interface JWTPayload {
  [key: string]: any;
}

/**
 * Decodes a JWT token and returns the RAW payload
 */
export const parseJWT = (token: string): JWTPayload | null => {
  try {
    if (!token || typeof token !== "string") return null;
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 */
export const isJWTExpired = (token: string): boolean => {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;

  return Date.now() >= payload.exp * 1000;
};

/**
 * Stores decoded JWT data (raw payload) directly in localStorage
 */
export const storeJWTData = (
  token: string,
  refreshToken?: string
): { payload: JWTPayload } | null => {
  const payload = parseJWT(token);
  console.log("Decoded JWT payload:", payload);
  if (!payload) return null;

  // Store tokens
  localStorage.setItem("auth_token", token);
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  // Store raw decoded payload
  localStorage.setItem("user_data", JSON.stringify(payload.user));
  localStorage.setItem("user_role", JSON.stringify(payload.user.user_type || ""));

  return { payload };
};
