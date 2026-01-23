export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  unit?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Address {
  id: number;
  userId: number;
  name: string;
  phone: string;
  detail: string;
  isDefault: boolean;
}