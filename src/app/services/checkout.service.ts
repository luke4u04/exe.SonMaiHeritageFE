import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

export interface CheckoutRequest {
  userId: number | null; // Allow null for guest checkout
  items: {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    productImage: string;
  }[];
  totalAmount: number;
  note?: string;
  shipFullName: string;
  shipPhone: string;
  shipEmail: string;
  shipStreet: string;
  shipWard: string;
  shipDistrict: string;
  shipProvince: string;
}

export interface CheckoutResponse {
  success: boolean;
  paymentUrl?: string;
  paymentCode: string;
  orderCode?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8081/api/checkout';

  processCheckout(checkoutData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.baseUrl}/simple`, checkoutData);
  }

  processPayOSCheckout(checkoutData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.baseUrl}/payos`, checkoutData);
  }

  convertCartItemsToCheckoutItems(cartItems: CartItem[]) {
    return cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productPrice: item.product.price,
      quantity: item.quantity,
      productImage: item.product.image
    }));
  }

}