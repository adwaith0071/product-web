export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  rating: {
    average: number;
    count: number;
  };
  variants: {
    ram: string;
    price: number;
    quantity: number;
  }[];
  images: {
    public_id: string;
    url: string;
    alt: string;
  }[];
  reviews: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  isNew?: boolean;
}
