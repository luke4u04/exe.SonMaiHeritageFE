import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductDetail } from '../../interfaces/productDetail.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {
  @Input() product!: ProductDetail;
  @Input() selectedQuantity = 1;
  @Output() quantityChanged = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<{ product: ProductDetail; quantity: number }>();
  @Output() buyNow = new EventEmitter<{ product: ProductDetail; quantity: number }>();
  @Output() addToWishlist = new EventEmitter<ProductDetail>();

  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
      this.quantityChanged.emit(this.selectedQuantity);
    }
  }

  increaseQuantity() {
    if (this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
      this.quantityChanged.emit(this.selectedQuantity);
    }
  }

  onQuantityChange() {
    if (this.selectedQuantity < 1) {
      this.selectedQuantity = 1;
    } else if (this.selectedQuantity > this.product.stock) {
      this.selectedQuantity = this.product.stock;
    }
    this.quantityChanged.emit(this.selectedQuantity);
  }

  onAddToCartClick() {
    this.addToCart.emit({
      product: this.product,
      quantity: this.selectedQuantity
    });
  }

  onBuyNowClick() {
    this.buyNow.emit({
      product: this.product,
      quantity: this.selectedQuantity
    });
  }

  onAddToWishlistClick() {
    this.addToWishlist.emit(this.product);
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

  getStockStatusText(): string {
    if (this.product.stock > 10) {
      return `✓ Còn hàng (${this.product.stock} sản phẩm)`;
    } else if (this.product.stock > 0) {
      return `⚠ Chỉ còn ${this.product.stock} sản phẩm`;
    } else {
      return '✗ Hết hàng';
    }
  }

  getStockStatusClass(): string {
    if (this.product.stock > 10) {
      return 'text-green-600 font-medium';
    } else if (this.product.stock > 0) {
      return 'text-orange-600 font-medium';
    } else {
      return 'text-red-600 font-medium';
    }
  }
}
