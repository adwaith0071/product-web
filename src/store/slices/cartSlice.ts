import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariant: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "id">>) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedVariant === action.payload.selectedVariant
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        const newItem: CartItem = {
          ...action.payload,
          id: `${action.payload.productId}-${
            action.payload.selectedVariant
          }-${Date.now()}`,
        };
        state.items.push(newItem);
      }

      toast.success(`${action.payload.name} added to cart!`);
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} removed from cart.`);
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload.id
          );
        }
      }
      toast.info(`Cart updated for ${item?.name}.`);
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      toast.info("Cart cleared.");
    },
    calculateTotals: (state) => {
      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
