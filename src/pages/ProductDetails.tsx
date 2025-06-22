import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Heart, Check, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const product = useAppSelector(state => 
    state.products.products.find(p => p.id === id)
  );
  const { items: wishlistItems } = useAppSelector(state => state.wishlist);
  
  const [selectedRam, setSelectedRam] = useState('4 GB');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
            <button
              onClick={() => navigate('/home')}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const productImages = [product.image, product.image]; // Mock multiple images

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      selectedVariant: selectedRam,
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout or cart page
    alert('Product added to cart! Redirecting to checkout...');
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
          <span className="text-gray-800">Product details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl border border-gray-200 p-4 md:p-8 overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg border-2 p-2 overflow-hidden ${
                    selectedImage === index ? 'border-amber-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm md:text-base">Availability:</span>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium text-sm md:text-base">In stock</span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Hurry up! only {product.stockCount} product left in stock!
            </div>

            {/* RAM Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ram:
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.ram.map((ram) => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRam(ram)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      selectedRam === ram
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity:
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="bg-amber-500 text-white px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold hover:bg-amber-600 transition-colors flex-1"
              >
                Edit product
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-amber-500 text-white px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold hover:bg-amber-600 transition-colors flex-1"
              >
                Buy it now
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-3 border-2 border-gray-300 rounded-full hover:border-red-300 hover:bg-red-50 transition-colors self-center sm:self-auto"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;