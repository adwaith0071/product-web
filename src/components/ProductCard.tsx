import React from "react";
import { Heart, Star } from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const name = product.title || product.name;
  const image = (product.images && product.images[0]?.url) || product.image;
  const price =
    product.price ??
    (product.variants &&
      Math.min(...product.variants.map((v: any) => v.price))) ??
    0;
  const rating = product.rating?.average ?? product.rating ?? 0;
  const reviews = product.rating?.count ?? product.reviews ?? 0;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative">
        <img className="h-48 w-full object-cover" src={image} alt={name} />
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isWishlisted
              ? "bg-red-100 text-red-500"
              : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-500"
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3
            className="text-lg font-semibold text-gray-800 truncate"
            title={name}
          >
            {name}
          </h3>
          <p className="text-xl font-bold text-gray-900 mt-2">
            ${price.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center mt-3 text-sm text-gray-600">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating) ? "text-amber-400" : "text-gray-300"
                }`}
                fill="currentColor"
              />
            ))}
          </div>
          <span className="ml-2">({reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
