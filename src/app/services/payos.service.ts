import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PayOSPaymentRequest {
  orderId: string;
  amount: number;
  orderDescription: string;
  returnUrl: string;
  cancelUrl: string;
  items: {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    productImage: string;
  }[];
}

export interface PayOSPaymentResponse {
  success: boolean;
  message: string;
  paymentUrl?: string;
  paymentCode?: string;
  orderCode?: string;
  amount?: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayOSService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Tạo link thanh toán PayOS
   */
  createPaymentLink(request: PayOSPaymentRequest): Observable<PayOSPaymentResponse> {
    return this.http.post<PayOSPaymentResponse>(`${this.apiUrl}/api/checkout/payos`, request);
  }

  /**
   * Xử lý kết quả thanh toán từ PayOS
   */
  handlePaymentReturn(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/checkout/payos/return`, { params });
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  checkPaymentStatus(paymentCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/payments/code/${paymentCode}`);
  }

  /**
   * Mở trang thanh toán PayOS
   */
  openPaymentPage(paymentUrl: string): void {
    window.open(paymentUrl, '_blank');
  }

  /**
   * Chuyển hướng đến trang thanh toán PayOS
   */
  redirectToPayment(paymentUrl: string): void {
    window.location.href = paymentUrl;
  }
}
