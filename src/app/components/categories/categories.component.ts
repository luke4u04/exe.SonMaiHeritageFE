import { Component, signal, OnInit, inject } from '@angular/core';
import { CategoryCardComponent } from "../category-card/category-card.component";
import { Category } from '../../interfaces/category.interface';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CategoryCardComponent, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private productService = inject(ProductService);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.isLoading.set(true);
    this.productService.getCategories().subscribe({
      next: (response: any[]) => {
        // Convert backend response to frontend Category interface
        const categories: Category[] = response.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: '/api/placeholder/300/200', // Default placeholder
          productCount: 0 // Will be updated when we have product count API
        }));
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.isLoading.set(false);
        // Show empty categories instead of mock data
        this.categories.set([]);
      }
    });
  }
}
