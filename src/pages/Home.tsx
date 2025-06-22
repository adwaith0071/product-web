import React, { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setCurrentPage } from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    filteredProducts,
    currentPage,
    itemsPerPage,
    selectedCategory,
    selectedSubcategory,
  } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header onMenuToggle={handleMenuToggle} showMenuButton={true} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={handleMenuClose}
          isMobile={true}
        />

        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 md:mb-6">
            <button
              onClick={() => navigate("/home")}
              className="hover:text-blue-600"
            >
              Home
            </button>
            {selectedCategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-800">{selectedCategory}</span>
              </>
            )}
            {selectedSubcategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-800">{selectedSubcategory}</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
            <button className="bg-amber-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2 text-sm md:text-base">
              <Plus className="w-4 h-4" />
              <span>Add category</span>
            </button>
            <button className="bg-amber-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2 text-sm md:text-base">
              <Plus className="w-4 h-4" />
              <span>Add sub category</span>
            </button>
            <button className="bg-amber-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2 text-sm md:text-base">
              <Plus className="w-4 h-4" />
              <span>Add product</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {currentProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredProducts.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
