import React from 'react';
import { ChevronRight, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const { items } = useAppSelector(state => state.wishlist);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      selectedVariant: product.variants.ram[0],
    }));
    dispatch(removeFromWishlist(product.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Back Button - Mobile */}
        <button
          onClick={() => navigate('/home')}
          className="lg:hidden flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Breadcrumb - Desktop */}
        <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => navigate('/home')}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800">Wishlist</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
            My Wishlist ({items.length})
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">♡</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding products you love to your wishlist
              </p>
              <button
                onClick={() => navigate('/home')}
                className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-lg transition-all duration-300 group"
                >
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

                  <div className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                    ${product.price.toFixed(2)}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-amber-500 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="p-2 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;