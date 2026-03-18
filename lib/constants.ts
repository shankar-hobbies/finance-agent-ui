/**
 * CREDENTIALS CONFIGURATION
 * 
 * Frontend Login Credentials:
 * - Allowed usernames: java, mule (case insensitive)
 * - Password: Abbcchat
 * 
 * Backend API Credentials (sent in request headers):
 * - Header password: Spiritas@469
 * 
 * NOTE: In production, never hardcode credentials. Use environment variables
 * and secure authentication backends instead.
 */

// Frontend login credentials
export const VALID_CREDENTIALS = {
  ALLOWED_USERS: ['java', 'mule'], // Case insensitive
  PASSWORD: 'Abbcchat',
};

// Backend API header credentials
export const BACKEND_CREDENTIALS = {
  PASSWORD: 'Spiritas@469',
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
