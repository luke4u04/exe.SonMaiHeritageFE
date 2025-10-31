import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderLookupRequest {
  orderCode: string;
}

export interface OrderLookupResponse {
  orderCode: string;
  status: string;
  createdAt: string;
  shipName: string;
  shipPhone: string;
  shipEmail: string;
  shipStreet: string;
  shipWard: string;
  shipDistrict: string;
  shipProvince: string;
  totalAmount: number;
  note?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productImage: string;
  quantity: number;
  price: number;
  productPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  createdDate: string;
  updatedDate?: string;
  shipFullName: string;
  shipPhone: string;
  shipEmail: string;
  shipStreet: string;
  shipWard: string;
  shipDistrict: string;
  shipProvince: string;
  paymentStatus: string;
  paymentMethod: string;
  orderItems: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  lookupOrder(orderCode: string): Observable<OrderLookupResponse> {
    const url = `${this.apiUrl}/api/orders/lookup/${orderCode}`;
    console.log('🔧 OrderService.lookupOrder calling URL:', url);
    console.log('🔧 apiUrl value:', this.apiUrl);
    return this.http.get<OrderLookupResponse>(url);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user/${userId}`);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPING': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPING': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return 'Không xác định';
    }
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}