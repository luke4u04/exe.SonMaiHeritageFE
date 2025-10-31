import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  // Computed properties
  get cartItems() {
    return this.cartService.getCartItems()();
  }

  get totalPrice() {
    return this.cartService.cartTotal()();
  }

  get cartCount() {
    return this.cartService.cartCount();
  }

  // Methods
  updateQuantity(item: CartItem, newQuantity: number) {
    this.cartService.updateQuantity(item.product.id, newQuantity);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  addToWishlist(item: CartItem) {
    this.cartService.addToWishlist(item.product);
  }
}
