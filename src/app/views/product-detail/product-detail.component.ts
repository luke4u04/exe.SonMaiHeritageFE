import { Component, inject } from '@angular/core';
import { ProductDetail } from '../../interfaces/productDetail.interface';
import { Product } from '../../interfaces/product.interface';
import { Review } from '../../interfaces/review.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImageGalleryComponent } from "../../components/product-image-gallery/product-image-gallery.component";
import { ProductInfoComponent } from "../../components/product-info/product-info.component";
import { ProductTabsComponent } from "../../components/product-tabs/product-tabs.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-product-detail',
  imports: [ProductImageGalleryComponent, ProductInfoComponent, ProductTabsComponent, BreadcrumbComponent, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private imageService = inject(ImageService);
  
  product: ProductDetail | null = null;
  reviews: Review[] = [];
  relatedProducts: ProductDetail[] = [];
  isLoading = true;
  selectedQuantity = 1;
  averageRating = 0;
  totalReviews = 0;
  
  breadcrumbs = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Sản phẩm', url: '/products' },
    { label: 'Chi tiết sản phẩm' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: number) {
    this.isLoading = true;
    
    this.productService.getProduct(productId).subscribe({
      next: (response: any) => {
        // Convert backend response to ProductDetail interface
        this.product = this.convertToProductDetail(response);
        this.reviews = this.generateMockReviews(); // Keep mock reviews for now
        this.relatedProducts = this.generateRelatedProducts();
        
        if (this.product) {
          this.breadcrumbs = [
            { label: 'Trang chủ', url: '/' },
            { label: 'Sản phẩm', url: '/products' },
            { label: this.product.name }
          ];
          this.calculateAverageRating();
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.product = null;
        this.isLoading = false;
        alert('Không thể tải chi tiết sản phẩm. Vui lòng kiểm tra kết nối backend.');
      }
    });
  }

  onQuantityChanged(quantity: number) {
    this.selectedQuantity = quantity;
  }

  onAddToCart(data: { product: ProductDetail; quantity: number }) {
    console.log('Add to cart:', data);
    // Convert ProductDetail to Product for cart service
    const product: Product = {
      id: data.product.id,
      name: data.product.name,
      price: data.product.price,
      originalPrice: data.product.originalPrice,
      description: data.product.description,
      image: data.product.images[0] || data.product.image,
      category: data.product.category,
      rating: data.product.rating,
      quantity: data.product.stock
    };
    
    // Add to cart with specified quantity
    for (let i = 0; i < data.quantity; i++) {
      this.cartService.addToCart(product);
    }
  }

  onBuyNow(data: { product: ProductDetail; quantity: number }) {
    console.log('Buy now:', data);
    // Navigate to checkout
  }

  onAddToWishlist(product: ProductDetail) {
    console.log('Add to wishlist:', product);
    // Implement wishlist logic
  }

  onReviewAdded(review: Review) {
    this.reviews.unshift(review);
    this.calculateAverageRating();
  }

  onRelatedProductSelected(product: ProductDetail) {
    this.router.navigate(['/products', product.id]);
  }

  goBackToProducts() {
    this.router.navigate(['/products']);
  }

  getSalePercentage(product: ProductDetail): number {
    if (!product.originalPrice || !product.isOnSale) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  private calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      this.totalReviews = 0;
      return;
    }
    
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
    this.totalReviews = this.reviews.length;
  }

  private convertToProductDetail(backendProduct: any): ProductDetail {
    return {
      id: backendProduct.id,
      name: backendProduct.name,
      price: backendProduct.price,
      originalPrice: undefined, // Backend doesn't have this field
      image: this.imageService.getImageUrl(backendProduct.pictureUrl),
      category: backendProduct.productType || 'Chưa phân loại',
      rating: 5, // Default rating since backend doesn't have this
      description: backendProduct.description || '',
      longDescription: backendProduct.description || 'Mô tả chi tiết sản phẩm sẽ được cập nhật sớm.',
      specifications: {
        'Chất liệu': 'Sơn mài truyền thống',
        'Xuất xứ': 'Việt Nam',
        'Kỹ thuật': 'Thủ công',
        'Màu sắc': 'Đa dạng',
        'Bảo hành': '12 tháng'
      },
      materials: ['Sơn mài thiên nhiên', 'Gỗ tự nhiên'],
      dimensions: {
        width: 15,
        height: 25,
        depth: 15
      },
      weight: 800,
      images: [
        this.imageService.getImageUrl(backendProduct.pictureUrl),
        this.imageService.getPlaceholderUrl(),
        this.imageService.getPlaceholderUrl()
      ],
      tags: ['sơn mài', 'thủ công', 'truyền thống'],
      isOnSale: false, // Backend doesn't have this field
      stock: backendProduct.quantity || 0,
      sku: `SM-${backendProduct.id}-001`,
      craftsman: 'Nghệ nhân truyền thống',
      craftingTime: '2-3 tuần',
      careInstructions: [
        'Lau chùi bằng khăn mềm, khô',
        'Tránh để ở nơi ẩm ướt',
        'Không sử dụng chất tẩy rửa mạnh',
        'Bảo quản ở nhiệt độ phòng'
      ]
    };
  }


  private generateMockReviews(): Review[] {
    return [
      {
        id: 1,
        userId: 1,
        userName: 'Nguyễn Thị Mai',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c8b3?w=50&h=50&fit=crop&crop=face&auto=format&q=80',
        rating: 5,
        title: 'Sản phẩm tuyệt vời!',
        comment: 'Chất lượng vượt mong đợi, họa tiết rất đẹp và tinh xảo. Đóng gói cẩn thận, giao hàng nhanh.',
        createdAt: new Date('2024-01-15'),
        helpful: 12,
        verified: true
      },
      {
        id: 2,
        userId: 2,
        userName: 'Trần Văn Nam',
        rating: 4,
        title: 'Đáng tiền',
        comment: 'Sản phẩm đẹp, chất lượng tốt. Giá hơi cao nhưng xứng đáng với chất lượng.',
        createdAt: new Date('2024-01-10'),
        helpful: 8,
        verified: true
      },
      {
        id: 3,
        userId: 3,
        userName: 'Lê Thị Hoa',
        rating: 5,
        title: 'Quà tặng hoàn hảo',
        comment: 'Mua làm quà tặng, người nhận rất thích. Sản phẩm sang trọng và độc đáo.',
        createdAt: new Date('2024-01-05'),
        helpful: 15,
        verified: false
      }
    ];
  }

  private generateRelatedProducts(): ProductDetail[] {
    // For now, return empty array. In the future, we can implement a related products API
    return [];
  }
}
