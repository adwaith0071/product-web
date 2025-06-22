import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 3) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 1) {
        pages.push(1);
        if (totalPages > 3) {
          pages.push("...");
        }
        for (let i = Math.max(totalPages - 2, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(e.target.value);
    onItemsPerPageChange(newItemsPerPage);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 md:mt-8 space-y-4 sm:space-y-0">
      <div className="text-xs md:text-sm text-gray-600 order-2 sm:order-1">
        {startItem} of {totalItems} items
      </div>

      <div className="flex items-center space-x-1 md:space-x-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 md:px-3 py-2 text-gray-500 text-sm">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-amber-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 order-3">
        <span>Show</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-gray-300 rounded px-7 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs md:text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span>rows</span>
      </div>
    </div>
  );
};

export default Pagination;
