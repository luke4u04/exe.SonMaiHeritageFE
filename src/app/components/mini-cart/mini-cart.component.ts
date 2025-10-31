import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { RouterConstant } from '../../constants/routerConstants';

@Component({
  selector: 'app-mini-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.css'
})
export class MiniCartComponent {
  cartService = inject(CartService);
  router = inject(Router);

  get cartItems() {
    return this.cartService.cartItemsList();
  }

  get totalPrice() {
    return this.cartService.totalPrice();
  }

  get cartCount() {
    return this.cartService.cartCount();
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    this.cartService.updateQuantity(item.product.id, newQuantity);
  }

  goToCart() {
    this.router.navigate([RouterConstant.cart]);
  }
}
