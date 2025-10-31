import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../interfaces/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems = signal<CartItem[]>([]);
  private wishlistItems = signal<Product[]>([]);

  cartCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));
  wishlistCount = signal(3);
  showCart = signal(false);

  // Computed values
  cartItemsList = computed(() => this.cartItems());
  totalPrice = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  addToCart(product: Product) {
    const current = this.cartItems();
    const existingItem = current.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // Increase quantity if product already exists
      this.cartItems.set(
        current.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new item
      this.cartItems.set([...current, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number) {
    const current = this.cartItems();
    this.cartItems.set(current.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const current = this.cartItems();
    this.cartItems.set(
      current.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }

  addToWishlist(product: Product) {
    const current = this.wishlistItems();
    if (!current.find(item => item.id === product.id)) {
      this.wishlistItems.set([...current, product]);
      this.wishlistCount.set(this.wishlistCount() + 1);
    }
  }

  removeFromWishlist(productId: number) {
    const current = this.wishlistItems();
    this.wishlistItems.set(current.filter(item => item.id !== productId));
    this.wishlistCount.set(this.wishlistCount() - 1);
  }

  toggleCart() {
    this.showCart.set(!this.showCart());
  }

  // Methods for components
  getCartItems() {
    return this.cartItemsList;
  }

  cartTotal() {
    return this.totalPrice;
  }

  getCartTotal() {
    return this.totalPrice;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}
