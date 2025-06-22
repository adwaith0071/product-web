import React, { useState, useCallback, useEffect } from "react";
import {
  X,
  ChevronDown,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { SubCategory, Product } from "../types";

interface Variant {
  id: number;
  ram: string;
  price: string;
  quantity: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (formData: FormData) => Promise<void>;
  onUpdateProduct?: (productId: string, formData: FormData) => Promise<void>;
  subCategories: SubCategory[];
  isLoading: boolean;
  initialData?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onUpdateProduct,
  subCategories,
  isLoading,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    SubCategory | undefined
  >();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");

      // Find the subcategory by ID - handle both string and object cases
      const subCategoryId =
        typeof initialData.subcategory === "string"
          ? initialData.subcategory
          : (initialData.subcategory as any)?.id;

      const initialSubCategory = subCategories.find(
        (sc) => sc.id === subCategoryId
      );

      console.log("Setting initial subcategory:", {
        subCategoryId,
        initialSubCategory,
        subCategories: subCategories.map((sc) => ({
          id: sc.id,
          name: sc.name,
        })),
        initialDataSubcategory: initialData.subcategory,
      });

      setSelectedSubCategory(
        initialSubCategory ||
          (subCategories.length > 0 ? subCategories[0] : undefined)
      );
      setVariants(
        initialData.variants && initialData.variants.length > 0
          ? initialData.variants.map((v, i) => ({
              id: i,
              ram: v.ram,
              price: String(v.price),
              quantity: String(v.quantity),
            }))
          : [{ id: Date.now(), ram: "", price: "", quantity: "1" }]
      );
      setExistingImages(initialData.images || []);
      setImages([]);
    } else {
      setTitle("");
      setDescription("");
      setSelectedSubCategory(subCategories[0]);
      setVariants([]);
      setExistingImages([]);
      setImages([]);
    }
  }, [initialData, subCategories]);

  useEffect(() => {
    if (!selectedSubCategory && subCategories.length > 0 && !initialData) {
      setSelectedSubCategory(subCategories[0]);
    }
  }, [subCategories, selectedSubCategory, initialData]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: Date.now(), ram: "", price: "", quantity: "1" },
    ]);
  };

  const handleVariantChange = (
    id: number,
    field: keyof Omit<Variant, "id">,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariant = (id: number) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (public_id: string) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.public_id !== public_id)
    );
  };

  const handleSubmit = async () => {
    console.log("Validation check:", {
      title: !!title,
      description: !!description,
      selectedSubCategory: !!selectedSubCategory,
      selectedSubCategoryId: selectedSubCategory?.id,
      variants: variants.length,
      initialData: !!initialData,
    });

    if (!title || !description || !selectedSubCategory) {
      setError("Please fill all required fields.");
      return;
    }

    // Additional validation for variants
    if (variants.length === 0) {
      setError("Please add at least one variant.");
      return;
    }

    // Validate each variant has required fields
    const invalidVariants = variants.filter(
      (v) => !v.ram || !v.price || !v.quantity
    );
    if (invalidVariants.length > 0) {
      setError("Please fill all variant fields (RAM, Price, Quantity).");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subCategory", selectedSubCategory.id);

    const sanitizedVariants = variants.map((v) => ({
      ram: v.ram,
      price: parseFloat(v.price) || 0,
      quantity: parseInt(v.quantity, 10) || 0,
    }));

    formData.append("variants", JSON.stringify(sanitizedVariants));

    // Handle images properly for editing
    if (initialData && onUpdateProduct) {
      // For editing: keep remaining existing images and add new ones
      const hasNewImages = images.length > 0;
      const hasRemovedExistingImages =
        existingImages.length < (initialData.images?.length || 0);

      console.log("Image handling for edit:", {
        initialImagesCount: initialData.images?.length || 0,
        remainingExistingImagesCount: existingImages.length,
        newImagesCount: images.length,
        hasNewImages,
        hasRemovedExistingImages,
        finalImageCount: existingImages.length + images.length,
      });

      // Send the remaining existing images as JSON (these will be kept)
      formData.append("existingImages", JSON.stringify(existingImages));

      // Send new images as files (these will be added)
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Set replaceImages to false to add to existing images
      formData.append("replaceImages", "false");
    } else {
      // For new products: just send new images
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      if (initialData && onUpdateProduct) {
        await onUpdateProduct(initialData.id, formData);
      } else {
        await onAddProduct(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add product.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {initialData ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Variants
            </label>
            <div className="space-y-3">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="grid grid-cols-1 md:grid-cols-10 gap-3 items-center"
                >
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      placeholder="RAM"
                      value={variant.ram}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "ram", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "price", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <button
                      onClick={() =>
                        handleVariantChange(
                          variant.id,
                          "quantity",
                          String(Math.max(1, Number(variant.quantity) - 1))
                        )
                      }
                      className="p-2 border rounded-l-lg"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <input
                      type="text"
                      value={variant.quantity}
                      onChange={(e) =>
                        handleVariantChange(
                          variant.id,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="w-12 text-center border-t border-b px-1 py-2"
                    />
                    <button
                      onClick={() =>
                        handleVariantChange(
                          variant.id,
                          "quantity",
                          String(Number(variant.quantity) + 1)
                        )
                      }
                      className="p-2 border rounded-r-lg"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="md:col-span-1">
                    <button
                      onClick={() => handleRemoveVariant(variant.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddVariant}
              className="mt-3 flex items-center space-x-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
            >
              <Plus size={16} />
              <span>Add variants</span>
            </button>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Sub category
            </label>
            <div className="relative">
              <select
                value={selectedSubCategory?.id || ""}
                onChange={(e) =>
                  setSelectedSubCategory(
                    subCategories.find((sc) => sc.id === e.target.value)
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
              >
                {subCategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload image
            </label>
            {initialData &&
              (images.length > 0 ||
                existingImages.length < (initialData.images?.length || 0)) && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Images will be uploaded with your new
                    selection.
                  </p>
                </div>
              )}
            <div className="flex items-center gap-4">
              <div
                {...getRootProps()}
                className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-gray-400 hover:bg-gray-50 cursor-pointer"
              >
                <input {...getInputProps()} />
                <Plus size={32} />
              </div>
              <div className="flex-grow flex items-center gap-4 overflow-x-auto">
                {existingImages.map((img) => (
                  <div key={img.public_id} className="relative flex-shrink-0">
                    <img
                      src={img.url}
                      alt="preview"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => removeExistingImage(img.public_id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {images.map((file, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-amber-300"
              disabled={isLoading}
            >
              {isLoading
                ? initialData
                  ? "Saving..."
                  : "Adding..."
                : initialData
                ? "Save Changes"
                : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
