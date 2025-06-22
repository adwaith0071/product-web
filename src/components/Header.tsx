import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  setSearchQuery,
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsBySubCategory,
  setCurrentPage,
} from "../store/slices/productSlice";
import { logoutUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  showMenuButton = false,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { itemCount } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const {
    selectedCategory,
    selectedSubcategory,
    categories,
    allSubCategories,
    itemsPerPage,
    searchQuery,
  } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Sync search input with Redux state
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const searchTerm = searchInput.trim();

    if (!searchTerm) {
      return;
    }

    // Reset to page 1 when searching
    dispatch(setCurrentPage(1));
    dispatch(setSearchQuery(searchTerm));

    // Search based on current filter state
    if (selectedSubcategory) {
      // Search within selected subcategory
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
              search: searchTerm,
            },
          })
        );
      }
    } else if (selectedCategory) {
      // Search within selected category
      const category = categories.find((cat) => cat.name === selectedCategory);
      if (category) {
        dispatch(
          fetchProductsByCategory({
            categoryId: category.id,
            params: {
              page: 1,
              limit: itemsPerPage,
              search: searchTerm,
            },
          })
        );
      }
    } else {
      // Search all products
      dispatch(
        fetchProducts({
          page: 1,
          limit: itemsPerPage,
          search: searchTerm,
        })
      );
    }

    setIsSearchExpanded(false);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    dispatch(setSearchQuery(""));
    dispatch(setCurrentPage(1));

    // Fetch products without search based on current filter state
    if (selectedSubcategory) {
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
    } else if (selectedCategory) {
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
    } else {
      dispatch(
        fetchProducts({
          page: 1,
          limit: itemsPerPage,
        })
      );
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout API fails, we should still navigate to signin
      navigate("/signin");
    }
  };

  return (
    <header className="bg-brand-dark py-3 md:py-4 px-4 md:px-6 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-white hover:text-amber-300 transition-colors p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Logo/Brand - Hidden on mobile when search is expanded */}
        <div
          className={`text-white font-bold text-lg md:text-xl ${
            isSearchExpanded ? "hidden" : "block"
          } md:block`}
        ></div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-2 md:mx-8">
          <div className="relative">
            {/* Mobile Search Toggle */}
            <div className="md:hidden">
              {!isSearchExpanded ? (
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(true)}
                  className="text-white hover:text-amber-300 transition-colors p-2"
                >
                  <Search className="w-6 h-6" />
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search any things"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full bg-white text-gray-800 rounded-full py-2 pl-5 pr-24 text-sm focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-1 right-1 bg-amber-500 text-white font-semibold rounded-full px-4 text-sm hover:bg-amber-600 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchExpanded(false);
                      handleClearSearch();
                    }}
                    className="text-white hover:text-amber-300 transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search any things"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white text-gray-800 rounded-full py-2 pl-5 pr-28 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute inset-y-1 right-1 bg-amber-500 text-white font-semibold rounded-full px-6 hover:bg-amber-600 transition-colors"
              >
                Search
              </button>
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-1 right-20 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Right side actions - Hidden on mobile when search is expanded */}
        <div
          className={`flex items-center space-x-3 md:space-x-6 ${
            isSearchExpanded ? "hidden" : "flex"
          } md:flex`}
        >
          {/* Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="relative text-white hover:text-amber-300 transition-colors"
          >
            <Heart className="w-5 h-5 md:w-6 md:h-6" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                {wishlistItems.length}
              </span>
            )}
          </button>

          {/* User */}
          {user ? (
            <div className="flex items-center space-x-2 text-white">
              <User className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium hidden sm:block text-sm md:text-base">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 md:ml-4 text-amber-300 hover:text-amber-400 transition-colors text-sm md:text-base"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="text-white hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:block text-sm md:text-base">
                Sign in
              </span>
            </button>
          )}

          {/* Cart */}
          <button className="relative text-white hover:text-amber-300 transition-colors flex items-center space-x-1">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden sm:block text-sm md:text-base">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
