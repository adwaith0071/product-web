import React, { useEffect } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchWishlist } from "../store/slices/wishlistSlice";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";

const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems, isLoading } = useAppSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {isLoading && wishlistItems.length === 0 ? (
          <p>Loading wishlist...</p>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add items that you want to save for later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
