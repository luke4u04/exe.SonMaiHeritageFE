import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  quantity: number;
  description: string;
  isOnSale?: boolean;
  originalPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/products/all`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/api/products/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/products/types`);
  }

  searchProducts(keyword: string): Observable<any> {
    const url = `${this.baseUrl}/api/products?keyword=${encodeURIComponent(keyword)}`;
    console.log('Search URL:', url);
    return this.http.get<any>(url);
  }

  getProductsByType(typeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/products?typeId=${typeId}`);
  }
}