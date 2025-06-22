import { API_CONFIG } from "../config/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Auth API calls
  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${this.baseURL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<{ user: any }>(response);
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseURL}/auth/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<void>(response);
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  removeToken(): void {
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiService = new ApiService();
export default apiService;
