import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-image-gallery',
  imports: [CommonModule],
  templateUrl: './product-image-gallery.component.html',
  styleUrl: './product-image-gallery.component.css'
})
export class ProductImageGalleryComponent {
  @Input() image: string = '';
  @Input() productName = '';
  @Input() isOnSale = false;
  @Input() salePercentage = 0;

  isModalOpen = false;

  openImageModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }
}
