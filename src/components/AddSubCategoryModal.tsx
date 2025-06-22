import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Category } from "../types";

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubCategory: (
    subCategoryName: string,
    categoryId: string
  ) => Promise<void>;
  categories: Category[];
  isLoading: boolean;
}

const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddSubCategory,
  categories,
  isLoading,
}) => {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const handleAdd = async () => {
    if (!subCategoryName.trim()) {
      setError("Sub-category name is required.");
      return;
    }
    if (!selectedCategory) {
      setError("Please select a category.");
      return;
    }

    try {
      await onAddSubCategory(subCategoryName, selectedCategory.id);
      setSubCategoryName("");
      setError("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add sub-category.");
    }
  };

  const handleClose = () => {
    setSubCategoryName("");
    setSelectedCategory(categories.length > 0 ? categories[0] : null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Add Sub Category
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={selectedCategory?.id || ""}
                onChange={(e) => {
                  const category =
                    categories.find((c) => c.id === e.target.value) || null;
                  setSelectedCategory(category);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-amber-500 focus:border-amber-500"
                disabled={isLoading}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label
              htmlFor="subCategoryName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sub Category Name
            </label>
            <input
              type="text"
              id="subCategoryName"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              placeholder="Enter sub-category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Discard
            </button>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:bg-amber-300"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;
