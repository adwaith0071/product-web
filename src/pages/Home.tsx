import React, { useState, useEffect } from "react";
import { ChevronRight, Plus, Search } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import AddCategoryModal from "../components/AddCategoryModal";
import AddSubCategoryModal from "../components/AddSubCategoryModal";
import AddProductModal from "../components/AddProductModal";

import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  setCurrentPage,
  createCategory,
  createSubCategory,
  fetchCategories,
  fetchSubCategories,
  createProduct,
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsBySubCategory,
  setSearchQuery,
  setItemsPerPage,
} from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] =
    useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [addProductModalKey, setAddProductModalKey] = useState(0);
  const {
    filteredProducts,
    currentPage,
    itemsPerPage,
    selectedCategory,
    selectedSubcategory,
    isLoading,
    categories,
    allSubCategories,
    pagination,
    searchQuery,
  } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Handle pagination for filtered results
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));

    // If we have a selected category, fetch products for that category with pagination
    if (selectedCategory) {
      const category = categories.find((cat) => cat.name === selectedCategory);
      if (category) {
        dispatch(
          fetchProductsByCategory({
            categoryId: category.id,
            params: {
              page,
              limit: itemsPerPage,
              search: searchQuery,
            },
          })
        );
      }
    }
    // If we have a selected subcategory, fetch products for that subcategory with pagination
    else if (selectedSubcategory) {
      const subCategory = allSubCategories.find(
        (sub) => sub.name === selectedSubcategory
      );
      if (subCategory) {
        dispatch(
          fetchProductsBySubCategory({
            subCategoryId: subCategory.id,
            params: {
              page,
              limit: itemsPerPage,
              search: searchQuery,
            },
          })
        );
      }
    }
    // Otherwise, fetch all products with pagination and search
    else {
      dispatch(
        fetchProducts({
          page,
          limit: itemsPerPage,
          search: searchQuery,
        })
      );
    }
  };

  // Handle search functionality
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(setCurrentPage(1));

    // If we have a selected category, search within that category
    if (selectedCategory) {
      const category = categories.find((cat) => cat.name === selectedCategory);
      if (category) {
        dispatch(
          fetchProductsByCategory({
            categoryId: category.id,
            params: {
              page: 1,
              limit: itemsPerPage,
              search: query,
            },
          })
        );
      }
    }
    // If we have a selected subcategory, search within that subcategory
    else if (selectedSubcategory) {
      const subCategory = allSubCategories.find(
        (sub) => sub.name === selectedSubcategory
      );
      if (subCategory) {
        dispatch(
          fetchProductsBySubCategory({
            subCategoryId: subCategory.id,
            params: {
              page: 1,
              limit: itemsPerPage,
              search: query,
            },
          })
        );
      }
    }
    // Otherwise, search all products
    else {
      dispatch(
        fetchProducts({
          page: 1,
          limit: itemsPerPage,
          search: query,
        })
      );
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    dispatch(setSearchQuery(""));
    dispatch(setCurrentPage(1));

    // If we have a selected category, fetch products for that category without search
    if (selectedCategory) {
      const category = categories.find((cat) => cat.name === selectedCategory);
      if (category) {
        dispatch(
          fetchProductsByCategory({
            categoryId: category.id,
            params: {
              page: 1,
              limit: itemsPerPage,
            },
          })
        );
      }
    }
    // If we have a selected subcategory, fetch products for that subcategory without search
    else if (selectedSubcategory) {
      const subCategory = allSubCategories.find(
        (sub) => sub.name === selectedSubcategory
      );
      if (subCategory) {
        dispatch(
          fetchProductsBySubCategory({
            subCategoryId: subCategory.id,
            params: {
              page: 1,
              limit: itemsPerPage,
            },
          })
        );
      }
    }
    // Otherwise, fetch all products without search
    else {
      dispatch(
        fetchProducts({
          page: 1,
          limit: itemsPerPage,
        })
      );
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    dispatch(setItemsPerPage(newItemsPerPage));
    dispatch(setCurrentPage(1));

    // If we have a selected category, fetch products for that category with new limit
    if (selectedCategory) {
      const category = categories.find((cat) => cat.name === selectedCategory);
      if (category) {
        dispatch(
          fetchProductsByCategory({
            categoryId: category.id,
            params: {
              page: 1,
              limit: newItemsPerPage,
              search: searchQuery,
            },
          })
        );
      }
    }
    // If we have a selected subcategory, fetch products for that subcategory with new limit
    else if (selectedSubcategory) {
      const subCategory = allSubCategories.find(
        (sub) => sub.name === selectedSubcategory
      );
      if (subCategory) {
        dispatch(
          fetchProductsBySubCategory({
            subCategoryId: subCategory.id,
            params: {
              page: 1,
              limit: newItemsPerPage,
              search: searchQuery,
            },
          })
        );
      }
    }
    // Otherwise, fetch all products with new limit
    else {
      dispatch(
        fetchProducts({
          page: 1,
          limit: newItemsPerPage,
          search: searchQuery,
        })
      );
    }
  };

  // Determine pagination values
  const isFiltered = selectedCategory || selectedSubcategory;

  // For filtered results, use API pagination
  // For unfiltered results, use API pagination
  let totalPages, totalItems, currentProducts;

  if (pagination) {
    // API pagination for all results
    totalPages = pagination.totalPages;
    totalItems = pagination.totalProducts;
    currentProducts = filteredProducts;
  } else {
    // Fallback pagination
    totalItems = filteredProducts.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    currentProducts = filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAddCategory = async (categoryName: string) => {
    await dispatch(createCategory(categoryName)).unwrap();
    await dispatch(fetchCategories());
    setIsAddCategoryModalOpen(false);
  };

  const handleAddSubCategory = async (name: string, categoryId: string) => {
    await dispatch(createSubCategory({ name, categoryId })).unwrap();
    await dispatch(fetchSubCategories());
    setIsAddSubCategoryModalOpen(false);
  };

  const handleAddProduct = async (formData: FormData) => {
    await dispatch(createProduct(formData)).unwrap();
    await dispatch(fetchProducts({}));
    await dispatch(fetchSubCategories());
    setIsAddProductModalOpen(false);
    setAddProductModalKey((k) => k + 1); // force remount to reset modal state
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
            {searchQuery && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-800">Search: "{searchQuery}"</span>
              </>
            )}
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-4 md:mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800">
                    Search results for "{searchQuery}"
                    {isFiltered && (
                      <span className="ml-1">
                        {selectedCategory && ` in ${selectedCategory}`}
                        {selectedSubcategory && ` > ${selectedSubcategory}`}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="bg-amber-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2 text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add category</span>
            </button>
            <button
              onClick={() => setIsAddSubCategoryModalOpen(true)}
              className="bg-amber-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2 text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add sub category</span>
            </button>
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="bg-amber-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2 text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add product</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && currentProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products found"}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search terms or browse all products"
                  : isFiltered
                  ? "No products found for the selected category/subcategory"
                  : "Try adding some products or adjusting your search criteria"}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems || filteredProducts.length}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
        isLoading={isLoading}
      />
      <AddSubCategoryModal
        isOpen={isAddSubCategoryModalOpen}
        onClose={() => setIsAddSubCategoryModalOpen(false)}
        onAddSubCategory={handleAddSubCategory}
        categories={categories}
        isLoading={isLoading}
      />
      <AddProductModal
        key={addProductModalKey}
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        subCategories={allSubCategories}
        isLoading={isLoading}
        initialData={null}
      />
    </div>
  );
};

export default Home;
