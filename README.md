# Product Management App

A modern web application for managing products, categories, subcategories, and wishlists. Built with React, Redux Toolkit, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Sign up and sign in with JWT-based authentication.
- **Product Management**: Add, edit, delete, and view products with support for variants (e.g., RAM).
- **Category & Subcategory Management**: Organize products into categories and subcategories.
- **Wishlist**: Add/remove products to a personal wishlist.
- **Search & Pagination**: Search products and navigate through paginated results.
- **Responsive UI**: Clean, modern, and mobile-friendly interface.

## Getting Started

### Prerequisites

- **Node.js** (v18 or above recommended)
- **npm** (v9 or above recommended)

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd product-web
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure API Endpoint:**

   The app expects a backend API. By default, it uses `http://localhost:5000/api`.  
   To change this, create a `.env` file in the root and set:

   ```
   VITE_API_URL=http://your-api-url/api
   ```

### Running the Application

- **Development mode:**

  ```sh
  npm run dev
  ```

  The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

- **Production build:**

  ```sh
  npm run build
  ```

- **Preview production build:**

  ```sh
  npm run preview
  ```

- **Lint the code:**
  ```sh
  npm run lint
  ```

## Project Structure

```
src/
  components/      # Reusable UI components (modals, header, sidebar, etc.)
  pages/           # Main pages (Home, ProductDetails, Wishlist)
  store/           # Redux slices and store setup
  services/        # API service layer
  hooks/           # Custom React hooks
  config/          # App configuration (API endpoints, etc.)
  types/           # TypeScript type definitions
  index.css        # Tailwind and global styles
  main.tsx         # App entry point
```

## Key Packages & Why They Are Used

- **React**: Core UI library for building user interfaces.
- **Redux Toolkit**: Simplifies Redux state management, provides best practices out of the box.
- **React Redux**: Connects React components to the Redux store.
- **React Router DOM**: Handles client-side routing for SPA navigation.
- **TypeScript**: Adds static typing for safer, more maintainable code.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **React Toastify**: Provides beautiful, customizable toast notifications.
- **Lucide React**: Icon library for modern, consistent icons.
- **React Dropzone**: Handles file uploads (e.g., product images).
- **Node Fetch**: Used for making HTTP requests (mainly for SSR or Node environments).
- **Vite**: Fast build tool and dev server for modern web projects.
- **ESLint**: Linting tool to enforce code quality and consistency.
- **@types/\***: TypeScript type definitions for libraries.

## Environment Variables

- `VITE_API_URL`: The base URL for the backend API (default: `http://localhost:5000/api`).

## Additional Notes

- The app expects a compatible backend API for authentication, product, category, subcategory, and wishlist endpoints.
- All state management is handled via Redux Toolkit for scalability.
- The UI is fully responsive and works well on both desktop and mobile devices.

---

Feel free to customize this README further based on your backend setup or any additional features!
