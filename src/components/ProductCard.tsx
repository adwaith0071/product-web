import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../store/slices/productSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useAppSelector(state => state.wishlist);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
    >
      {product.isNew && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
          Adithyan.n
        </div>
      )}
      
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 p-1.5 md:p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 z-10"
      >
        <Heart
          className={`w-4 h-4 md:w-5 md:h-5 ${
            isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
          } transition-colors`}
        />
      </button>

      <div className="aspect-square bg-gray-50 rounded-lg mb-3 md:mb-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors text-sm md:text-base line-clamp-2">
        {product.name}
      </h3>

      <div className="flex items-center mb-2">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 md:w-4 md:h-4 ${
                star <= Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs md:text-sm text-gray-500 ml-2">({product.reviews})</span>
      </div>

      <div className="text-lg md:text-xl font-bold text-gray-900">
        ${product.price.toFixed(2)}
      </div>
    </div>
  );
};

export default ProductCard;