import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  variants: {
    ram: string[];
  };
  description: string;
  isNew?: boolean;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  subcategories: { [key: string]: string[] };
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'HP AMD Ryzen 3',
    price: 529.99,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Laptop',
    subcategory: 'HP',
    rating: 4.2,
    reviews: 156,
    inStock: true,
    stockCount: 34,
    variants: { ram: ['4 GB', '8 GB', '16 GB'] },
    description: 'High-performance laptop with AMD Ryzen 3 processor',
    isNew: true,
  },
  {
    id: '2',
    name: 'HP A MD Ryzen 3',
    price: 529.99,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Laptop',
    subcategory: 'HP',
    rating: 4.2,
    reviews: 145,
    inStock: true,
    stockCount: 28,
    variants: { ram: ['4 GB', '8 GB', '16 GB'] },
    description: 'Reliable performance laptop for everyday tasks',
  },
  {
    id: '3',
    name: 'HP AMD Ryzen 3',
    price: 529.99,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Laptop',
    subcategory: 'HP',
    rating: 4.2,
    reviews: 189,
    inStock: true,
    stockCount: 15,
    variants: { ram: ['4 GB', '8 GB', '16 GB'] },
    description: 'Premium laptop with advanced features',
  },
  {
    id: '4',
    name: 'HP AMD Ryzen 3',
    price: 529.99,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Laptop',
    subcategory: 'HP',
    rating: 4.2,
    reviews: 203,
    inStock: true,
    stockCount: 42,
    variants: { ram: ['4 GB', '8 GB', '16 GB'] },
    description: 'Powerful laptop for professional use',
  },
  {
    id: '5',
    name: 'HP AMD Ryzen 3',
    price: 529.99,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Laptop',
    subcategory: 'HP',
    rating: 4.2,
    reviews: 167,
    inStock: true,
    stockCount: 23,
    variants: { ram: ['4 GB', '8 GB', '16 GB'] },
    description: 'Versatile laptop for work and entertainment',
  },
  {
    id: '6',
    name: 'HP AMD Ryzen 3',
    price: 529.99,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Laptop',
    subcategory: 'HP',
    rating: 4.2,
    reviews: 234,
    inStock: true,
    stockCount: 31,
    variants: { ram: ['4 GB', '8 GB', '16 GB'] },
    description: 'Latest generation laptop with enhanced performance',
  },
];

const initialState: ProductState = {
  products: mockProducts,
  filteredProducts: mockProducts,
  categories: ['Laptop', 'Tablet', 'Headphones'],
  subcategories: {
    'Laptop': ['HP', 'Dell'],
    'Tablet': ['iPad', 'Samsung'],
    'Headphones': ['Sony', 'Bose']
  },
  selectedCategory: null,
  selectedSubcategory: null,
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 10,
  isLoading: false,
};

const productSlice = createSlice({
  name: 'products',
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
      productSlice.caseReducers.filterProducts(state);
    },
    setSelectedSubcategory: (state, action: PayloadAction<string | null>) => {
      state.selectedSubcategory = action.payload;
      state.currentPage = 1;
      productSlice.caseReducers.filterProducts(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      productSlice.caseReducers.filterProducts(state);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    filterProducts: (state) => {
      let filtered = state.products;

      if (state.selectedCategory) {
        filtered = filtered.filter(product => product.category === state.selectedCategory);
      }

      if (state.selectedSubcategory) {
        filtered = filtered.filter(product => product.subcategory === state.selectedSubcategory);
      }

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query)
        );
      }

      state.filteredProducts = filtered;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      productSlice.caseReducers.filterProducts(state);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
        productSlice.caseReducers.filterProducts(state);
      }
    },
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setSelectedSubcategory,
  setSearchQuery,
  setCurrentPage,
  addProduct,
  updateProduct,
} = productSlice.actions;

export default productSlice.reducer;