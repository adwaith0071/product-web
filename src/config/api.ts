// API Configuration
// BASE_URL precedence: 1) VITE_API_URL env variable, 2) Render server, 3) localhost
export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_URL ||
    "https://product-server-4-azyo.onrender.com/api" ||
    "http://localhost:5000/api",
  TIMEOUT: 10000, // 10 seconds
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
