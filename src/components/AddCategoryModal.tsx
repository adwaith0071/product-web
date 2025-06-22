import React, { useState } from "react";
import { X } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (categoryName: string) => Promise<void>;
  isLoading: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
  isLoading,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }
    try {
      await onAddCategory(categoryName);
      setCategoryName("");
      setError("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add category.");
    }
  };

  const handleClose = () => {
    setCategoryName("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Add Category</h3>
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
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3">
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

export default AddCategoryModal;
