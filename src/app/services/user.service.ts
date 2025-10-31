import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order.interface';
import { Payment } from '../interfaces/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  /**
   * Get user orders
   */
  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/user/${userId}`);
  }

  /**
   * Get user payments
   */
  getUserPayments(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/payments/user/${userId}`);
  }

  /**
   * Get order by code
   */
  getOrderByCode(orderCode: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/code/${orderCode}`);
  }

  /**
   * Get payment by order ID
   */
  getPaymentByOrderId(orderId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/payments/order/${orderId}`);
  }
}
