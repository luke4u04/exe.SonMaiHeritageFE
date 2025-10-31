import { Component, inject, Input } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CartService } from '../../../app/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  
  private cartService = inject(CartService);
  Math = Math;

  addToCart() {
    console.log('Add to cart clicked for product:', this.product);
    console.log('Product quantity:', this.product.quantity);
    
    if (this.product.quantity && this.product.quantity > 0) {
      try {
        this.cartService.addToCart(this.product);
        console.log('Successfully added to cart:', this.product.name);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      console.log('Product out of stock, quantity:', this.product.quantity);
    }
  }

  addToWishlist() {
    // Implement wishlist functionality if needed
    console.log('Added to wishlist:', this.product.name);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}
