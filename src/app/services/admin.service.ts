import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatistics } from '../interfaces/order.interface';
import { Payment, PaymentStatistics } from '../interfaces/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // Order Management
  getAllOrders(page: number = 0, size: number = 10, sortBy: string = 'createdDate', sortDir: string = 'desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    return this.http.get<any>(`${this.baseUrl}/orders`, { params });
  }

  getGuestOrders(page: number = 0, size: number = 10, sortBy: string = 'createdDate', sortDir: string = 'desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    return this.http.get<any>(`${this.baseUrl}/orders/guest`, { params });
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/user/${userId}`);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/status/${status}`);
  }

  getPaidOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/paid`);
  }

  getOrderByCode(orderCode: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/code/${orderCode}`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${orderId}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Order>(`${this.baseUrl}/orders/${orderId}/status`, null, { params });
  }

  getOrderStatistics(): Observable<OrderStatistics> {
    return this.http.get<OrderStatistics>(`${this.baseUrl}/orders/statistics`);
  }

  // Payment Management
  getAllPayments(page: number = 0, size: number = 10, sortBy: string = 'createdDate', sortDir: string = 'desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    return this.http.get<any>(`${this.baseUrl}/payments`, { params });
  }

  getPaymentById(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/payments/${paymentId}`);
  }

  getPaymentByCode(paymentCode: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/payments/code/${paymentCode}`);
  }


  getPaymentsByStatus(status: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/payments/status/${status}`);
  }

  getSuccessfulPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/payments/successful`);
  }

  getPaymentByOrderId(orderId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/payments/order/${orderId}`);
  }

  getPaymentStatistics(): Observable<PaymentStatistics> {
    return this.http.get<PaymentStatistics>(`${this.baseUrl}/payments/statistics`);
  }
}

