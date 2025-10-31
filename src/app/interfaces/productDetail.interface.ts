import { Product } from "./product.interface";

export interface ProductDetail extends Product {
  description: string;
  longDescription: string;
  specifications: { [key: string]: string };
  materials: string[];
  dimensions: {
    width: number;
    height: number;
    depth?: number;
  };
  weight: number;
  images: string[];
  tags: string[];
  isOnSale: boolean;
  stock: number;
  sku: string;
  craftsman: string;
  craftingTime: string;
  careInstructions: string[];
}