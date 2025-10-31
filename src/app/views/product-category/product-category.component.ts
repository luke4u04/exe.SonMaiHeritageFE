import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { FilterGroup } from '../../interfaces/filterGroup.interface';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FilterSidebarComponent } from "../../components/filter-sidebar/filter-sidebar.component";
import { ProductSortComponent } from "../../components/product-sort/product-sort.component";
import { ProductGridComponent } from "../../components/product-grid/product-grid.component";
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterConstant } from '../../constants/routerConstants';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-category',
  imports: [CommonModule, BreadcrumbComponent, FilterSidebarComponent, ProductSortComponent, ProductGridComponent],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent implements OnInit {
  
  productService = inject(ProductService)
  imageService = inject(ImageService);
  router = inject(Router)
  route = inject(ActivatedRoute)
  cartService = inject(CartService)

  products: Product[] = [];
  filteredProducts: Product[] = [];
  totalProducts = 0;
  isLoading = false;
  isLoadingMore = false;
  hasMoreProducts = true;
  currentPage = 1;
  productsPerPage = 12;
  
  selectedFilters: { [key: string]: string[] } = {};
  currentSortOption = 'newest';
  searchQuery = '';
  
  breadcrumbs = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Sản phẩm', url: '/products' }
  ];

  filterGroups: FilterGroup[] = [];

  ngOnInit() {
    // Check for search query parameter
    this.route.queryParams.subscribe(params => {
      console.log('Query params received:', params);
      if (params['search']) {
        this.searchQuery = params['search'];
        console.log('Search query from URL:', this.searchQuery);
        this.searchProducts();
      } else {
        console.log('No search query, loading all products');
        this.loadProducts();
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    
    this.productService.getProducts().subscribe({
      next: (response: any[]) => {
        // Convert backend response to frontend Product interface
        this.products = response.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: this.imageService.getImageUrl(item.pictureUrl),
          category: item.productType,
          rating: 5, // Default rating
          quantity: item.quantity,
          description: item.description,
          isOnSale: Math.random() > 0.7, // Random sale status for demo
          originalPrice: Math.random() > 0.7 ? item.price * 1.2 : undefined
        }));
        this.totalProducts = this.products.length;
        this.generateFilterGroups();
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        // Show error message instead of fallback to mock data
        this.products = [];
        this.totalProducts = 0;
        this.isLoading = false;
        alert('Không thể tải sản phẩm. Vui lòng kiểm tra kết nối backend.');
      }
    });
  }

  searchProducts() {
    if (!this.searchQuery.trim()) {
      this.loadProducts();
      return;
    }

    console.log('Searching for:', this.searchQuery);
    this.isLoading = true;
    
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (response: any) => {
        console.log('Search response:', response);
        
        // Handle both List and Page response
        let productList: any[] = [];
        console.log('Response type:', typeof response);
        console.log('Is array:', Array.isArray(response));
        console.log('Has content:', response && response.content);
        
        if (Array.isArray(response)) {
          productList = response;
          console.log('Using direct array response');
        } else if (response && response.content) {
          productList = response.content;
          console.log('Using page content response');
        } else {
          console.error('Unexpected response format:', response);
          productList = [];
        }
        
        console.log('Product list length:', productList.length);
        
        // Convert backend response to frontend Product interface
        this.products = productList.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: this.imageService.getImageUrl(item.pictureUrl),
          category: item.productType,
          rating: 5, // Default rating
          quantity: item.quantity,
          description: item.description,
          isOnSale: Math.random() > 0.7, // Random sale status for demo
          originalPrice: Math.random() > 0.7 ? item.price * 1.2 : undefined
        }));
        this.totalProducts = this.products.length;
        this.generateFilterGroups();
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error searching products:', error);
        this.products = [];
        this.totalProducts = 0;
        this.isLoading = false;
        alert('Không thể tìm kiếm sản phẩm. Vui lòng thử lại.');
      }
    });
  }

  loadMoreProducts() {
    this.isLoadingMore = true;
    this.currentPage++;
    
    // Simulate loading more products
    setTimeout(() => {
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const endIndex = startIndex + this.productsPerPage;
      
      if (startIndex >= this.products.length) {
        this.hasMoreProducts = false;
      }
      
      this.applyFiltersAndSort();
      this.isLoadingMore = false;
    }, 800);
  }

  onFiltersChanged(filters: { [key: string]: string[] }) {
    this.selectedFilters = filters;
    this.currentPage = 1;
    this.hasMoreProducts = true;
    this.applyFiltersAndSort();
  }

  onSortChanged(sortOption: string) {
    this.currentSortOption = sortOption;
    this.applyFiltersAndSort();
  }

  onProductSelected(product: Product) {
    // Navigate to product detail page
    this.router.navigate([RouterConstant.productCategory, product.id]);
  }

  onAddToCart(product: Product) {
    console.log('Add to cart:', product);
    if (product.quantity && product.quantity > 0) {
      try {
        this.cartService.addToCart(product);
        console.log('Successfully added to cart:', product.name);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      console.log('Product out of stock, quantity:', product.quantity);
    }
  }

  private applyFiltersAndSort() {
    let filtered = [...this.products];
    
    // Apply filters
    Object.keys(this.selectedFilters).forEach(filterKey => {
      const selectedValues = this.selectedFilters[filterKey];
      if (selectedValues && selectedValues.length > 0) {
        filtered = filtered.filter(product => {
          switch (filterKey) {
            case 'category':
              const categoryId = product.category.toLowerCase().replace(/\s+/g, '-');
              return selectedValues.includes(categoryId);
            case 'priceRange':
              return this.checkPriceRange(product.price, selectedValues);
            default:
              return true;
          }
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.currentSortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default:
          return 0; // Keep original order for newest
      }
    });

    // Apply pagination
    const endIndex = this.currentPage * this.productsPerPage;
    this.filteredProducts = filtered.slice(0, endIndex);
    this.hasMoreProducts = endIndex < filtered.length;
  }

  private checkPriceRange(price: number, selectedRanges: string[]): boolean {
    return selectedRanges.some(range => {
      switch (range) {
        case 'under-500k':
          return price < 500000;
        case '500k-700k':
          return price >= 500000 && price < 700000;
        case '700k-1m':
          return price >= 700000 && price < 1000000;
        case '1m-1.5m':
          return price >= 1000000 && price < 1500000;
        case '1.5m-2m':
          return price >= 1500000 && price < 2000000;
        case '2m-5m':
          return price >= 2000000 && price < 5000000;
        case 'above-5m':
          return price >= 5000000;
        default:
          return true;
      }
    });
  }

  private generateFilterGroups() {
    // Generate category filter from actual product categories
    const categoryMap = new Map<string, number>();
    this.products.forEach(product => {
      const category = product.category;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const categoryOptions = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      count: count
    }));

    // Generate price range filter
    const priceRangeOptions = [
      { id: 'under-500k', name: 'Dưới 500.000₫', count: 0 },
      { id: '500k-700k', name: '500.000₫ - 700.000₫', count: 0 },
      { id: '700k-1m', name: '700.000₫ - 1.000.000₫', count: 0 },
      { id: '1m-1.5m', name: '1.000.000₫ - 1.500.000₫', count: 0 },
      { id: '1.5m-2m', name: '1.500.000₫ - 2.000.000₫', count: 0 },
      { id: '2m-5m', name: '2.000.000₫ - 5.000.000₫', count: 0 },
      { id: 'above-5m', name: 'Trên 5.000.000₫', count: 0 }
    ];
    
    console.log('🔧 DEBUG: Updated price range options:', priceRangeOptions);

    // Count products in each price range
    this.products.forEach(product => {
      const price = product.price;
      if (price < 500000) priceRangeOptions[0].count++;
      else if (price < 700000) priceRangeOptions[1].count++;
      else if (price < 1000000) priceRangeOptions[2].count++;
      else if (price < 1500000) priceRangeOptions[3].count++;
      else if (price < 2000000) priceRangeOptions[4].count++;
      else if (price < 5000000) priceRangeOptions[5].count++;
      else priceRangeOptions[6].count++;
    });
    
    console.log('🔧 DEBUG: Price range counts after processing:', priceRangeOptions);

    this.filterGroups = [
      {
        title: 'Danh mục',
        key: 'category',
        options: categoryOptions
      },
      {
        title: 'Khoảng giá',
        key: 'priceRange',
        options: priceRangeOptions.filter(option => option.count > 0)
      }
    ];
  }


}
