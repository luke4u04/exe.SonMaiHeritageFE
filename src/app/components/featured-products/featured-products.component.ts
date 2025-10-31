import { Component, signal, OnInit, inject } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-products',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private imageService = inject(ImageService);
  featuredProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (response: any[]) => {
        // Convert backend response to frontend Product interface
        const products: Product[] = response.slice(0, 4).map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: this.imageService.getImageUrl(item.pictureUrl),
          category: item.productType,
          rating: 5, // Default rating
          quantity: item.quantity
        }));
        this.featuredProducts.set(products);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
        // Fallback to empty array or show error message
        this.featuredProducts.set([]);
      }
    });
  }

}
