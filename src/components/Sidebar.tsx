import React from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  setSelectedCategory,
  setSelectedSubcategory,
} from "../store/slices/productSlice";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  isMobile = false,
}) => {
  const { categories, subcategories, selectedCategory, selectedSubcategory } =
    useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(category));
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      dispatch(setSelectedSubcategory(null));
    } else {
      dispatch(setSelectedSubcategory(subcategory));
    }
    // Close mobile menu after selection
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleAllCategoriesClick = () => {
    dispatch(setSelectedCategory(null));
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <h3 className="text-lg font-semibold text-gray-800 mb-6 px-6 pt-6">
          Categories
        </h3>
      )}

      <div className="space-y-2 px-4 md:px-6 pb-6">
        <button
          onClick={handleAllCategoriesClick}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm md:text-base ${
            !selectedCategory
              ? "bg-amber-100 text-amber-800"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          All categories
        </button>

        {categories.map((category) => (
          <div key={category}>
            <button
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between text-sm md:text-base ${
                selectedCategory === category
                  ? "bg-amber-100 text-amber-800"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span>{category}</span>
              {subcategories[category] &&
                (selectedCategory === category ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                ))}
            </button>

            {selectedCategory === category && subcategories[category] && (
              <div className="ml-4 mt-2 space-y-2">
                {subcategories[category].map((subcategory) => (
                  <div
                    key={subcategory}
                    className="flex items-center space-x-3 px-4 py-2"
                  >
                    <input
                      type="radio"
                      id={subcategory}
                      name="subcategory"
                      checked={selectedSubcategory === subcategory}
                      onChange={() => handleSubcategoryClick(subcategory)}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                    />
                    <label
                      htmlFor={subcategory}
                      className="text-sm text-gray-600 cursor-pointer flex-1"
                    >
                      {subcategory}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto">{sidebarContent}</div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden lg:block w-64 xl:w-72 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
