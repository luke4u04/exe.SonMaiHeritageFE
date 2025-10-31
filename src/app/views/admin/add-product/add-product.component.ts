import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 vietnamese-text">Thêm sản phẩm mới</h2>
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Product Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2 vietnamese-text">
            Tên sản phẩm *
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập tên sản phẩm">
          <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" 
               class="text-orange-600 text-sm mt-1 vietnamese-text">
            Tên sản phẩm là bắt buộc
          </div>
        </div>

        <!-- Product Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2 vietnamese-text">
            Mô tả sản phẩm
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập mô tả sản phẩm">
          </textarea>
        </div>

        <!-- Price -->
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-2 vietnamese-text">
            Giá sản phẩm (VND) *
          </label>
          <input
            type="number"
            id="price"
            formControlName="price"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập giá sản phẩm">
          <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" 
               class="text-orange-600 text-sm mt-1 vietnamese-text">
            Giá sản phẩm phải lớn hơn 0
          </div>
        </div>

        <!-- Quantity -->
        <div>
          <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2 vietnamese-text">
            Số lượng *
          </label>
          <input
            type="number"
            id="quantity"
            formControlName="quantity"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập số lượng">
          <div *ngIf="productForm.get('quantity')?.invalid && productForm.get('quantity')?.touched" 
               class="text-orange-600 text-sm mt-1 vietnamese-text">
            Số lượng phải lớn hơn hoặc bằng 0
          </div>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2 vietnamese-text">
            Loại sản phẩm *
          </label>
          <select
            id="category"
            formControlName="category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Chọn loại sản phẩm</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
          <div *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched" 
               class="text-orange-600 text-sm mt-1 vietnamese-text">
            Vui lòng chọn loại sản phẩm
          </div>
        </div>

        <!-- Product Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 vietnamese-text">
            Ảnh sản phẩm *
          </label>
          
          <!-- Image Preview -->
          <div *ngIf="selectedImage" class="mb-4">
            <img [src]="selectedImage" [alt]="'Product preview'" 
                 class="max-w-xs max-h-48 rounded-lg border border-gray-300">
            <button type="button" (click)="removeImage()" 
                    class="mt-2 text-orange-600 hover:text-orange-800 text-sm vietnamese-text">
              Xóa ảnh
            </button>
          </div>

          <!-- Upload Area -->
          <div *ngIf="!selectedImage" 
               class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
               (click)="fileInput.click()">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-600 vietnamese-text">Click để chọn ảnh</p>
            <p class="text-xs text-gray-500 vietnamese-text">JPG, PNG, GIF (tối đa 5MB)</p>
          </div>

          <input
            #fileInput
            type="file"
            accept="image/*"
            (change)="onImageSelected($event)"
            class="hidden">

          <div *ngIf="productForm.get('image')?.invalid && productForm.get('image')?.touched" 
               class="text-orange-600 text-sm mt-1 vietnamese-text">
            Vui lòng chọn ảnh sản phẩm
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            (click)="router.navigate(['/admin'])"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 vietnamese-text">
            Hủy
          </button>
          <button
            type="submit"
            [disabled]="productForm.invalid || isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed vietnamese-text">
            {{ isSubmitting ? 'Đang thêm...' : 'Thêm sản phẩm' }}
          </button>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="text-orange-600 text-sm vietnamese-text">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="text-green-600 text-sm vietnamese-text">
          {{ successMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .vietnamese-text {
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class AddProductComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  router = inject(Router);

  productForm: FormGroup;
  selectedImage: string | null = null;
  categories: any[] = [];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [null, Validators.required]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/api/products/types`)
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.errorMessage = 'Không thể tải danh sách loại sản phẩm';
        }
      });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Vui lòng chọn file ảnh';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Kích thước file không được vượt quá 5MB';
        return;
      }

      this.errorMessage = '';
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
        this.productForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.productForm.patchValue({ image: null });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit() {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = new FormData();
      formData.append('name', this.productForm.value.name);
      formData.append('description', this.productForm.value.description || '');
      formData.append('price', this.productForm.value.price.toString());
      formData.append('quantity', this.productForm.value.quantity.toString());
      formData.append('typeId', this.productForm.value.category.toString());
      formData.append('image', this.productForm.value.image);

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post<any>(`${environment.apiUrl}/api/admin/products`, formData, { headers })
        .subscribe({
          next: (response) => {
            this.successMessage = 'Thêm sản phẩm thành công!';
            this.productForm.reset();
            this.selectedImage = null;
            this.isSubmitting = false;
            
            // Redirect after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error adding product:', error);
            this.errorMessage = error.error?.message || 'Lỗi khi thêm sản phẩm';
            this.isSubmitting = false;
          }
        });
    }
  }
}
