import { Component, Input } from '@angular/core';
import { ProductDetail } from '../../interfaces/productDetail.interface';
import { Review } from '../../interfaces/review.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-tabs',
  imports: [CommonModule],
  templateUrl: './product-tabs.component.html',
  styleUrl: './product-tabs.component.css'
})
export class ProductTabsComponent {
  @Input() product!: ProductDetail;
  @Input() reviews: Review[] = [];
  @Input() averageRating = 0;

  activeTab = 'description';
  
  tabs = [
    { id: 'description', label: 'Mô tả sản phẩm' },
    { id: 'specifications', label: 'Thông số kỹ thuật' },
    { id: 'shipping', label: 'Vận chuyển & Đổi trả' }
  ];

  getSpecificationEntries() {
    return Object.entries(this.product.specifications).map(([key, value]) => ({
      key,
      value
    }));
  }
}
