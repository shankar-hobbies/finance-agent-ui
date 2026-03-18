/**
 * CREDENTIALS & API CONFIGURATION
 * 
 * All sensitive data and configuration should be provided via environment variables.
 * 
 * Required Environment Variables:
 * - NEXT_PUBLIC_FRONTEND_PASSWORD: Frontend login password
 * - NEXT_PUBLIC_BACKEND_PASSWORD: Backend API password header
 * - NEXT_PUBLIC_BACKEND_API_URL: Backend API base URL
 * 
 * NOTE: NEXT_PUBLIC_* variables are exposed to the browser.
 * Never put secrets in these - only non-sensitive config.
 */

// Frontend login credentials
export const VALID_CREDENTIALS = {
  ALLOWED_USERS: ['java', 'mule'], // Case insensitive
  PASSWORD: process.env.NEXT_PUBLIC_FRONTEND_PASSWORD || '',
};

// Backend API configuration
export const BACKEND_CREDENTIALS = {
  PASSWORD: process.env.NEXT_PUBLIC_BACKEND_PASSWORD || '',
};

export const BACKEND_API = {
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://finance-agent-app.onrender.com',
};

/**
 * Validates if the provided username and password are correct
 * @param username - Username to validate (case insensitive)
 * @param password - Password to validate
 * @returns true if credentials are valid, false otherwise
 */
export function validateCredentials(username: string, password: string): boolean {
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedPassword = password.trim();

  const isUserValid = VALID_CREDENTIALS.ALLOWED_USERS.includes(normalizedUsername);
  const isPasswordValid = normalizedPassword === VALID_CREDENTIALS.PASSWORD;

  return isUserValid && isPasswordValid;
}
