import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CommonModule],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent {
  cartService = inject(CartService);

  // Computed properties
  get cartItems() {
    return this.cartService.cartItemsList();
  }

  get totalPrice() {
    return this.cartService.totalPrice();
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

  addToWishlist(item: CartItem) {
    this.cartService.addToWishlist(item.product);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
