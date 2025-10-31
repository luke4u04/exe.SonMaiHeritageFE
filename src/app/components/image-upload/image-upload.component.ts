import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-upload-container">
      <div class="upload-area" 
           [class.dragover]="isDragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="fileInput.click()">
        
        <div *ngIf="!selectedFile && !imageUrl" class="upload-placeholder">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p class="text-gray-600 mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
          <p class="text-sm text-gray-500">JPG, PNG, GIF (tối đa 5MB)</p>
        </div>

        <div *ngIf="selectedFile && !imageUrl" class="file-preview">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button (click)="removeFile()" class="text-red-500 hover:text-red-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div *ngIf="imageUrl" class="image-preview">
          <img [src]="imageUrl" [alt]="'Uploaded image'" class="max-w-full max-h-64 rounded-lg">
          <button (click)="removeImage()" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div *ngIf="isUploading" class="upload-progress">
          <div class="flex items-center justify-center p-4">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-600">Đang upload...</span>
          </div>
        </div>
      </div>

      <input 
        #fileInput
        type="file" 
        accept="image/*"
        (change)="onFileSelected($event)"
        class="hidden">

      <div *ngIf="errorMessage" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .image-upload-container {
      width: 100%;
    }
    
    .upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .upload-area:hover {
      border-color: #3b82f6;
      background-color: #f8fafc;
    }
    
    .upload-area.dragover {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }
    
    .image-preview {
      position: relative;
      display: inline-block;
    }
    
    .file-preview {
      text-align: left;
    }
  `]
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  selectedFile: File | null = null;
  imageUrl: string | null = null;
  isUploading = false;
  isDragOver = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File) {
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
    this.selectedFile = file;
    this.uploadFile();
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post<any>(`${environment.apiUrl}/api/upload/product-image`, formData, { headers })
      .subscribe({
        next: (response) => {
          this.imageUrl = response.imageUrl;
          this.isUploading = false;
          this.imageUploaded.emit(response.imageUrl);
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.errorMessage = error.error?.message || 'Lỗi khi upload ảnh';
          this.isUploading = false;
        }
      });
  }

  removeFile() {
    this.selectedFile = null;
    this.errorMessage = '';
  }

  removeImage() {
    this.imageUrl = null;
    this.selectedFile = null;
    this.imageRemoved.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
