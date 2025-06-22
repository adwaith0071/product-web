import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  fetchProductById,
  updateProductThunk,
  deleteProduct,
} from "../store/slices/productSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import Header from "../components/Header";
import AddProductModal from "../components/AddProductModal";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  CheckCircle,
  XCircle,
  Heart,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct, isLoading, error, allSubCategories } =
    useAppSelector((state) => state.products);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const [mainImage, setMainImage] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setMainImage(selectedProduct.images?.[0]?.url || "");
      setSelectedRam(selectedProduct.variants?.[0]?.ram || "");
    }
  }, [selectedProduct]);

  const handleUpdateProduct = async (productId: string, formData: FormData) => {
    await dispatch(updateProductThunk({ productId, formData })).unwrap();
    setIsEditModalOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      await dispatch(deleteProduct(selectedProduct.id)).unwrap();
      setIsConfirmModalOpen(false);
      navigate("/home");
    }
  };

  const productIsNotReady = !selectedProduct || selectedProduct.id !== id;

  if (!isEditModalOpen && !isConfirmModalOpen) {
    if (error) {
      return (
        <div className="bg-gray-50 min-h-screen">
          <Header />
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
            Error: {error}
          </div>
        </div>
      );
    }

    if (isLoading || productIsNotReady) {
      return (
        <div className="bg-gray-50 min-h-screen">
          <Header />
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!selectedProduct) {
      return (
        <div className="bg-gray-50 min-h-screen">
          <Header />
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
            Product not found.
          </div>
        </div>
      );
    }
  }

  if (!selectedProduct) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  const { title, variants, images, description } = selectedProduct;
  const isWishlisted = wishlistItems.some(
    (item) => item.id === selectedProduct.id
  );
  const selectedVariant = variants.find((v) => v.ram === selectedRam);
  const stockCount = selectedVariant?.quantity || 0;
  const inStock = stockCount > 0;

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(selectedProduct.id));
    } else {
      dispatch(addToWishlist(selectedProduct));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8 relative z-20">
          <button
            onClick={() => navigate("/home")}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800">Product details</span>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden border">
              <img
                src={mainImage}
                alt={title}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {images.map((img: any) => (
                <div
                  key={img.public_id}
                  onClick={() => setMainImage(img.url)}
                  className={`aspect-square bg-white rounded-md cursor-pointer border-2 ${
                    mainImage === img.url
                      ? "border-amber-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt="thumbnail"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-4xl font-extrabold text-gray-800">
              ${selectedVariant?.price.toFixed(2)}
            </p>
            <div>
              <div className="flex items-center space-x-2">
                {inStock ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                <span
                  className={`font-semibold ${
                    inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
              {inStock && (
                <p className="text-sm text-gray-500 mt-1">
                  Hurry up! only {stockCount} product left in stock!
                </p>
              )}
            </div>

            <hr />

            <div>
              <p className="font-semibold text-gray-700 mb-3">Ram:</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.ram}
                    onClick={() => setSelectedRam(v.ram)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedRam === v.ram
                        ? "bg-amber-100 border-amber-500 text-amber-800 font-semibold"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {v.ram}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-3">Quantity:</p>
              <div className="flex items-center border border-gray-300 rounded-lg w-min">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border-l border-r">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(stockCount, q + 1))
                  }
                  className="px-4 py-2"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600"
              >
                Edit product
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="flex-1 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700"
              >
                Delete Product
              </button>
              <button className="flex-1 bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900">
                Buy it now
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Heart
                  className={`w-6 h-6 text-gray-700 ${
                    isWishlisted ? "fill-red-500" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </main>
      {isEditModalOpen && selectedProduct && (
        <AddProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={async () => {}}
          initialData={selectedProduct}
          subCategories={allSubCategories}
          isLoading={isLoading}
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductDetails;
