import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css'
})
export class ProductGridComponent {
  @Input() products: any[] = [];
  @Input() isLoading = false;
  @Output() productSelected = new EventEmitter<any>();
  @Output() addToCart = new EventEmitter<any>();

  onProductClick(product: any) {
    this.productSelected.emit(product);
  }

  onAddToCartClick(product: any) {
    event?.stopPropagation();
    this.addToCart.emit(product);
  }

  getSalePercentage(product: any): number {
    if (!product.originalPrice || !product.isOnSale) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  getStars(rating: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  getButtonClass(quantity: number): string {
    if (!quantity || quantity <= 0) {
      return 'bg-gray-400 text-gray-600';
    }
    return 'bg-amber-600 hover:bg-amber-700 text-white';
  }
}
