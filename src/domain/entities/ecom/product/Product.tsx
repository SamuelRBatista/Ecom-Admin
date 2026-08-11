// domain/entities/ecom/product/Product.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  costPrice?: number;
  sku: string;
  barCode?: string;
  imageUrl: string;
  categoryId: number;
  supplierId?: number;
  stockQuantity: number;
  minimumStock?: number;
  unitOfMeasure?: string;
  weight?: number;
  height?: number;
  width?: number;
  depth?: number;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  material?: string;
  manufacturer?: string;
  manufactureDate?: string;
  expirationDate?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isDigital: boolean;
  hasVariants: boolean;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  viewsCount: number;
  createdAt: string;
  updatedAt?: string;
  status: string;
  visibility: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  observations?: string;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}

export interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
  description?: string;
  order: number;
}

export interface ProductAttribute {
  id: number;
  key: string;
  value: string;
  group?: string;
  displayOrder?: number;
}