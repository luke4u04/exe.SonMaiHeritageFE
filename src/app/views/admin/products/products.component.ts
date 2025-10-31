import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  status: string;
  typeName: string;
  typeId: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 vietnamese-text">Quản lý sản phẩm</h1>
        <div class="flex space-x-2">
          <button
            (click)="seedProducts()"
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors vietnamese-text">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Tạo dữ liệu mẫu
          </button>
          <button
            (click)="router.navigate(['/admin/add-product'])"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors vietnamese-text">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Thêm sản phẩm mới
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded vietnamese-text">
        {{ errorMessage }}
      </div>

      <!-- Products Table -->
      <div *ngIf="!loading && !errorMessage" class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider vietnamese-text">
                    Sản phẩm
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider vietnamese-text">
                    Loại
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider vietnamese-text">
                    Giá
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider vietnamese-text">
                    Số lượng
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider vietnamese-text">
                    Trạng thái kho
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider vietnamese-text">
                    Trạng thái kinh doanh
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider vietnamese-text">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let product of products" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-16 w-16">
                        <img [src]="product.pictureUrl" [alt]="product.name" 
                             class="h-16 w-16 object-cover rounded-md">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 vietnamese-text">
                          {{ product.name }}
                        </div>
                        <div class="text-sm text-gray-500 vietnamese-text truncate max-w-xs">
                          {{ product.description }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 vietnamese-text">
                      {{ product.typeName }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 vietnamese-text">
                    {{ formatPrice(product.price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <button 
                        (click)="decreaseQuantity(product)"
                        [disabled]="product.quantity <= 0"
                        class="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Giảm số lượng">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                        {{ product.quantity }}
                      </span>
                      <button 
                        (click)="increaseQuantity(product)"
                        class="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                        title="Tăng số lượng">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStockStatusClass(product.quantity)" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full vietnamese-text">
                      {{ getStockStatus(product.quantity) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getBusinessStatusClass(product.status)" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full vietnamese-text">
                      {{ getBusinessStatus(product.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      (click)="editProduct(product)"
                      class="text-blue-600 hover:text-blue-900 vietnamese-text">
                      Sửa
                    </button>
                    <button
                      (click)="toggleProductStatus(product)"
                      [class]="getToggleButtonClass(product.status)"
                      class="vietnamese-text">
                      {{ getToggleButtonText(product.status) }}
                    </button>
                    <button
                      (click)="deleteProduct(product)"
                      class="text-red-600 hover:text-red-900 vietnamese-text">
                      Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="products.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 vietnamese-text">Chưa có sản phẩm nào</h3>
            <p class="mt-1 text-sm text-gray-500 vietnamese-text">Hãy thêm sản phẩm đầu tiên của bạn!</p>
            <div class="mt-6">
              <button
                (click)="router.navigate(['/admin/add-product'])"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 vietnamese-text">
                Thêm sản phẩm đầu tiên
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vietnamese-text {
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class ProductsComponent implements OnInit {
  private http = inject(HttpClient);
  router = inject(Router);

  products: Product[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<Product[]>(`${environment.apiUrl}/api/admin/products`, { headers })
      .subscribe({
        next: (products) => {
          console.log('Admin products loaded:', products);
          console.log('Number of products:', products.length);
          // Admin should see ALL products (including INACTIVE ones)
          this.products = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.errorMessage = 'Không thể tải danh sách sản phẩm';
          this.loading = false;
        }
      });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Hết hàng';
    if (quantity < 10) return 'Sắp hết';
    return 'Còn hàng';
  }

  getStockStatusClass(quantity: number): string {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  getBusinessStatus(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Đang kinh doanh';
      case 'INACTIVE': return 'Tạm ngừng';
      case 'DISCONTINUED': return 'Ngừng sản xuất';
      default: return 'Không xác định';
    }
  }

  getBusinessStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-yellow-100 text-yellow-800';
      case 'DISCONTINUED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getToggleButtonText(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Tạm ngừng';
      case 'INACTIVE': return 'Kích hoạt';
      case 'DISCONTINUED': return 'Kích hoạt';
      default: return 'Kích hoạt';
    }
  }

  getToggleButtonClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'text-yellow-600 hover:text-yellow-900';
      case 'INACTIVE': return 'text-green-600 hover:text-green-900';
      case 'DISCONTINUED': return 'text-green-600 hover:text-green-900';
      default: return 'text-green-600 hover:text-green-900';
    }
  }

  editProduct(product: Product) {
    // TODO: Implement edit functionality
    console.log('Edit product:', product);
    alert('Chức năng sửa sản phẩm sẽ được cập nhật sớm');
  }

  toggleProductStatus(product: Product) {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'kích hoạt' : 'tạm ngừng';
    
    if (confirm(`Bạn có chắc chắn muốn ${action} sản phẩm "${product.name}"?`)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.patch(`${environment.apiUrl}/api/admin/products/${product.id}/status?status=${newStatus}`, {}, { headers })
        .subscribe({
          next: () => {
            alert(`Đã ${action} sản phẩm thành công`);
            this.loadProducts(); // Reload the list
          },
          error: (error) => {
            console.error('Error updating product status:', error);
            alert('Lỗi khi cập nhật trạng thái sản phẩm');
          }
        });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.delete(`${environment.apiUrl}/api/admin/products/${product.id}`, { headers })
        .subscribe({
          next: () => {
            alert('Xóa sản phẩm thành công');
            this.loadProducts(); // Reload the list
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            alert('Lỗi khi xóa sản phẩm');
          }
        });
    }
  }

  increaseQuantity(product: Product) {
    const newQuantity = product.quantity + 1;
    this.updateProductQuantity(product, newQuantity);
  }

  decreaseQuantity(product: Product) {
    if (product.quantity > 0) {
      const newQuantity = product.quantity - 1;
      this.updateProductQuantity(product, newQuantity);
    }
  }

  updateProductQuantity(product: Product, newQuantity: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const updateData = {
      quantity: newQuantity
    };

    this.http.patch(`${environment.apiUrl}/api/admin/products/${product.id}/quantity`, updateData, { headers })
      .subscribe({
        next: () => {
          // Cập nhật local state ngay lập tức để UI phản hồi nhanh
          product.quantity = newQuantity;
          console.log(`Đã cập nhật số lượng sản phẩm ${product.name} thành ${newQuantity}`);
        },
        error: (error) => {
          console.error('Error updating product quantity:', error);
          alert('Lỗi khi cập nhật số lượng sản phẩm');
          // Reload để đảm bảo data consistency
          this.loadProducts();
        }
      });
  }

  seedProducts() {
    if (confirm('Bạn có chắc chắn muốn tạo dữ liệu mẫu? Điều này sẽ thêm 10 sản phẩm mẫu vào database.')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post(`${environment.apiUrl}/api/admin/seed-products`, {}, { headers })
        .subscribe({
          next: (response: any) => {
            alert('Tạo dữ liệu mẫu thành công!');
            this.loadProducts(); // Reload the list
          },
          error: (error) => {
            console.error('Error seeding products:', error);
            alert('Lỗi khi tạo dữ liệu mẫu');
          }
        });
    }
  }
}
