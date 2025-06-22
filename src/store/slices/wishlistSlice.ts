import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api";
import { Product } from "../../types";
import { toast } from "react-toastify";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getWishlist();
      if (response.success && response.data) {
        return response.data.wishlist.map((p: any) => ({ ...p, id: p._id }));
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product: Product, { rejectWithValue }) => {
    try {
      await apiService.addToWishlist(product.id);
      toast.success(`${product.title} added to wishlist!`);
      return product;
    } catch (error: any) {
      toast.error(error.message || "Failed to add to wishlist.");
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: string, { rejectWithValue, getState }) => {
    try {
      await apiService.removeFromWishlist(productId);
      const state = getState() as { wishlist: WishlistState };
      const product = state.wishlist.items.find((p) => p.id === productId);
      toast.success(`${product?.title || "Item"} removed from wishlist!`);
      return productId;
    } catch (error: any) {
      toast.error(error.message || "Failed to remove from wishlist.");
      return rejectWithValue(error.message);
    }
  }
);

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(
        addToWishlist.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(
        removeFromWishlist.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      );
  },
});

export default wishlistSlice.reducer;
