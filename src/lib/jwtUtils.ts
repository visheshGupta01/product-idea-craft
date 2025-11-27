// JWT Parser Utility - Decodes JWT tokens and extracts payload data

export interface JWTPayload {
  id?: string;
  user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_type?: string;
  role?: string;
  verified?: boolean;
  plan_id?: string;
  credits?: number;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export const parseJWT = (token: string): JWTPayload | null => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part of JWT)
    const payload = parts[1];
    
    // Handle base64url encoding (replace - with + and _ with /)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Pad with = if necessary
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decode and parse JSON
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if expired, false otherwise
 */
export const isJWTExpired = (token: string): boolean => {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  return Date.now() >= payload.exp * 1000;
};

/**
 * Extracts user data from JWT payload and normalizes it
 * @param payload - The decoded JWT payload
 * @returns Normalized user data object
 */
export const extractUserDataFromJWT = (payload: JWTPayload): any => {
  return {
    id: payload.id || payload.user_id,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    user_type: payload.user_type || payload.role,
    verified: payload.verified,
    plan_id: payload.plan_id,
    credits: payload.credits,
  };
};

/**
 * Extracts role from JWT payload
 * @param payload - The decoded JWT payload
 * @returns The user role
 */
export const extractRoleFromJWT = (payload: JWTPayload): string => {
  return payload.role || payload.user_type || 'user';
};

/**
 * Stores JWT data in localStorage
 * @param token - The access token
 * @param refreshToken - The refresh token (optional)
 */
export const storeJWTData = (token: string, refreshToken?: string): { role: string; user: any } | null => {
  const payload = parseJWT(token);
  if (!payload) {
    return null;
  }

  const role = extractRoleFromJWT(payload);
  const user = extractUserDataFromJWT(payload);

  // Store tokens
  localStorage.setItem("auth_token", token);
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
  
  // Store parsed data from JWT
  localStorage.setItem("user_role", role);
  localStorage.setItem("user_data", JSON.stringify(user));

  return { role, user };
};
