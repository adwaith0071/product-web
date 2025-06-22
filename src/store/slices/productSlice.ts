import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";
import { Category, SubCategory, Product } from "../../types";

export const createCategory = createAsyncThunk(
  "products/createCategory",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      const response = await apiService.createCategory(categoryName);
      if (response.success && response.data) {
        const { _id, name } = response.data.category as any;
        return { id: _id, name } as Category;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        return response.data.categories.map(
          (cat: { _id: string; name: string }) => ({
            id: cat._id,
            name: cat.name,
          })
        );
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSubCategory = createAsyncThunk(
  "products/createSubCategory",
  async (
    {
      name,
      categoryId,
    }: {
      name: string;
      categoryId: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const response = await apiService.createSubCategory(name, categoryId);
      if (response.success && response.data) {
        const { products } = getState() as { products: ProductState };
        const category = products.categories.find((c) => c.id === categoryId);
        if (category) {
          return {
            subCategoryName: response.data.subCategory.name,
            categoryName: category.name,
          };
        }
      }
      return rejectWithValue(response.message || "Could not find category");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  "products/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getSubCategories();
      if (response.success && response.data) {
        return response.data.subCategories;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getProducts(params);
      if (response.success && response.data) {
        return {
          products: response.data.products.map((p: any) => ({
            ...p,
            id: p._id,
          })),
          pagination: response.data.pagination,
        };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (
    {
      categoryId,
      params,
    }: {
      categoryId: string;
      params?: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getProductsByCategory(
        categoryId,
        params
      );
      if (response.success && response.data) {
        return {
          products: response.data.products.map((p: any) => ({
            ...p,
            id: p._id,
          })),
          category: response.data.category,
          pagination: response.data.pagination,
        };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsBySubCategory = createAsyncThunk(
  "products/fetchProductsBySubCategory",
  async (
    {
      subCategoryId,
      params,
    }: {
      subCategoryId: string;
      params?: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getProductsBySubCategory(
        subCategoryId,
        params
      );
      if (response.success && response.data) {
        return {
          products: response.data.products.map((p: any) => ({
            ...p,
            id: p._id,
          })),
          subCategory: response.data.subCategory,
          pagination: response.data.pagination,
        };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getProductById(productId);
      if (response.success && response.data) {
        const product = response.data.product;
        return { ...product, id: product._id };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "products/updateProduct",
  async (
    { productId, formData }: { productId: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.updateProduct(productId, formData);
      if (response.success && response.data) {
        const product = response.data.product;
        return { ...product, id: product._id };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      await apiService.deleteProduct(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiService.createProduct(formData);
      if (response.success && response.data) {
        const product = response.data.product;
        return { ...product, id: product._id };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  allSubCategories: SubCategory[];
  subcategories: { [key: string]: string[] };
  selectedProduct: Product | null;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  } | null;
  filteredCategory: any | null;
  filteredSubCategory: any | null;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  categories: [],
  allSubCategories: [],
  subcategories: {},
  selectedProduct: null,
  selectedCategory: null,
  selectedSubcategory: null,
  searchQuery: "",
  currentPage: 1,
  itemsPerPage: 10,
  isLoading: false,
  error: null,
  pagination: null,
  filteredCategory: null,
  filteredSubCategory: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategory = null;
      state.currentPage = 1;
    },
    setSelectedSubcategory: (state, action: PayloadAction<string | null>) => {
      state.selectedSubcategory = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    setFilteredProductsEmpty: (state) => {
      state.filteredProducts = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: state.itemsPerPage,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.isLoading = false;
          state.categories.push(action.payload);
        }
      )
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.isLoading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createSubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createSubCategory.fulfilled,
        (
          state,
          action: PayloadAction<{
            subCategoryName: string;
            categoryName: string;
          }>
        ) => {
          state.isLoading = false;
          const { subCategoryName, categoryName } = action.payload;
          if (!state.subcategories[categoryName]) {
            state.subcategories[categoryName] = [];
          }
          state.subcategories[categoryName].push(subCategoryName);
        }
      )
      .addCase(createSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSubCategories.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.isLoading = false;
          const subCategoriesByCat: { [key: string]: string[] } = {};
          action.payload.forEach((subCategory) => {
            if (subCategory.category && subCategory.category.name) {
              const catName = subCategory.category.name;
              if (!subCategoriesByCat[catName]) {
                subCategoriesByCat[catName] = [];
              }
              subCategoriesByCat[catName].push(subCategory.name);
            }
          });
          state.subcategories = subCategoriesByCat;
          state.allSubCategories = action.payload.map((sc) => ({
            id: sc._id,
            name: sc.name,
          }));
        }
      )
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            pagination: any;
          }>
        ) => {
          state.isLoading = false;
          state.products = action.payload.products;
          state.filteredProducts = action.payload.products;
          state.filteredCategory = null;
          state.filteredSubCategory = null;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsByCategory.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            category: any;
            pagination: any;
          }>
        ) => {
          state.isLoading = false;
          state.filteredProducts = action.payload.products;
          state.filteredCategory = action.payload.category;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductsBySubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsBySubCategory.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            subCategory: any;
            pagination: any;
          }>
        ) => {
          state.isLoading = false;
          state.filteredProducts = action.payload.products;
          state.filteredSubCategory = action.payload.subCategory;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchProductsBySubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.products.unshift(action.payload);
          state.filteredProducts.unshift(action.payload);
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.selectedProduct = null;
        state.error = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProductThunk.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.selectedProduct = action.payload;
          const index = state.products.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
            state.filteredProducts[index] = action.payload;
          }
        }
      )
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.products = state.products.filter(
            (p) => p.id !== action.payload
          );
          state.filteredProducts = state.filteredProducts.filter(
            (p) => p.id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setSelectedSubcategory,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  setFilteredProductsEmpty,
} = productSlice.actions;

export default productSlice.reducer;
