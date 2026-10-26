// API Configuration
// Toggle between real API and mock data

export const API_CONFIG = {
  // Set to false to use mock data (for development without backend)
  USE_REAL_API: true,

  // Backend API URL - using Vite proxy (/api) by default or env variable
  BASE_URL: (import.meta.env?.VITE_API_URL as string) || "/api",

  // Timeout for API requests (milliseconds)
  TIMEOUT: 10000,
};

// Helper to check if we should use real API
export function shouldUseRealAPI(): boolean {
  return API_CONFIG.USE_REAL_API;
}

// Helper to get API base URL
export function getAPIBaseURL(): string {
  return API_CONFIG.BASE_URL;
}
