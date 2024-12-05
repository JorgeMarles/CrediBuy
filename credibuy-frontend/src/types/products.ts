// types/products.ts
export interface ProductType {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  product_type: number;
  product_type_name: string;
}

export interface PaginationData {
  count: number;
  next: string | null;
  previous: string | null;
  current: number;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FilterState {
  search: string;
  name: string;
  price: string;
  product_type__name: string;
}

export type OrderDirection = 'asc' | 'desc';
export type OrderingField = 'name' | 'price' | 'product_type__name';