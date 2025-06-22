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

  async createCategory(
    name: string
  ): Promise<ApiResponse<{ category: { name: string } }>> {
    const response = await fetch(`${this.baseURL}/categories`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    return this.handleResponse(response);
  }

  async getCategories(): Promise<
    ApiResponse<{ categories: { _id: string; name: string }[] }>
  > {
    const response = await fetch(`${this.baseURL}/categories`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createSubCategory(
    name: string,
    categoryId: string
  ): Promise<ApiResponse<{ subCategory: { name: string; category: string } }>> {
    const response = await fetch(`${this.baseURL}/subcategories`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, category: categoryId }),
    });
    return this.handleResponse(response);
  }

  async getSubCategories(): Promise<ApiResponse<{ subCategories: any[] }>> {
    const response = await fetch(`${this.baseURL}/subcategories`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<{ products: any[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${this.baseURL}/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Products fetched successfully",
        data: {
          products: data.data?.products || [],
          pagination: data.data?.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalProducts: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: params?.limit || 10,
          },
        },
      };
    }

    throw new Error(data.message || "Failed to fetch products");
  }

  async getProductById(
    productId: string
  ): Promise<ApiResponse<{ product: any }>> {
    const response = await fetch(`${this.baseURL}/products/${productId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createProduct(
    formData: FormData
  ): Promise<ApiResponse<{ product: any }>> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseURL}/products`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  async updateProduct(
    productId: string,
    formData: FormData
  ): Promise<ApiResponse<{ product: any }>> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseURL}/products/${productId}`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  async getWishlist(): Promise<ApiResponse<{ wishlist: any[] }>> {
    const response = await fetch(`${this.baseURL}/wishlist`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async addToWishlist(
    productId: string
  ): Promise<ApiResponse<{ wishlist: any[] }>> {
    const response = await fetch(`${this.baseURL}/wishlist/${productId}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async removeFromWishlist(
    productId: string
  ): Promise<ApiResponse<{ wishlist: any[] }>> {
    const response = await fetch(`${this.baseURL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteProduct(productId: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseURL}/products/${productId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProductsByCategory(
    categoryId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<ApiResponse<{ category: any; products: any[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${this.baseURL}/categories/${categoryId}/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      // Handle the case where category exists but has no products
      if (response.status === 404) {
        // Category not found
        throw new Error("Category not found");
      }

      const data = await response.json();

      // If the response is successful but has no products, return empty result
      if (response.ok) {
        return {
          success: true,
          message: data.message || "Products fetched successfully",
          data: {
            category: data.data?.category || null,
            products: data.data?.products || [],
            pagination: data.data?.pagination || {
              currentPage: 1,
              totalPages: 0,
              totalProducts: 0,
              hasNextPage: false,
              hasPrevPage: false,
              limit: params?.limit || 10,
            },
          },
        };
      }

      // If there's an error, throw it
      throw new Error(data.message || "Failed to fetch products by category");
    } catch (error: any) {
      // If it's a network error or other issue, return empty result
      console.warn(`API Error for category ${categoryId}:`, error);
      return {
        success: true,
        message: "No products found",
        data: {
          category: null,
          products: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalProducts: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: params?.limit || 10,
          },
        },
      };
    }
  }

  async getProductsBySubCategory(
    subCategoryId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<
    ApiResponse<{ subCategory: any; products: any[]; pagination: any }>
  > {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${this.baseURL}/subcategories/${subCategoryId}/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      // Handle the case where subcategory exists but has no products
      if (response.status === 404) {
        // Subcategory not found
        throw new Error("Subcategory not found");
      }

      const data = await response.json();

      // If the response is successful but has no products, return empty result
      if (response.ok) {
        return {
          success: true,
          message: data.message || "Products fetched successfully",
          data: {
            subCategory: data.data?.subCategory || null,
            products: data.data?.products || [],
            pagination: data.data?.pagination || {
              currentPage: 1,
              totalPages: 0,
              totalProducts: 0,
              hasNextPage: false,
              hasPrevPage: false,
              limit: params?.limit || 10,
            },
          },
        };
      }

      // If there's an error, throw it
      throw new Error(
        data.message || "Failed to fetch products by subcategory"
      );
    } catch (error: any) {
      // If it's a network error or other issue, return empty result
      console.warn(`API Error for subcategory ${subCategoryId}:`, error);
      return {
        success: true,
        message: "No products found",
        data: {
          subCategory: null,
          products: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalProducts: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: params?.limit || 10,
          },
        },
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
