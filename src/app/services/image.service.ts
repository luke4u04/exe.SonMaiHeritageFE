import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly backendUrl = 'http://localhost:8081';

  /**
   * Get proper image URL for product
   */
  getImageUrl(pictureUrl: string): string {
    console.log('ImageService - Input pictureUrl:', pictureUrl);
    
    if (!pictureUrl) {
      const fallback = 'https://via.placeholder.com/300x300?text=No+Image';
      console.log('ImageService - No pictureUrl, using fallback:', fallback);
      return fallback;
    }
    
    // If it's already a full URL (S3 or other), return as is
    if (pictureUrl.startsWith('http://') || pictureUrl.startsWith('https://')) {
      console.log('ImageService - Already full URL (S3 or other):', pictureUrl);
      return pictureUrl;
    }
    
    // If it's a relative path (local storage), prepend backend URL
    if (pictureUrl.startsWith('/')) {
      const fullUrl = `${this.backendUrl}${pictureUrl}?t=${Date.now()}`;
      console.log('ImageService - Relative path (local), full URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's just a filename, assume it's in uploads/products/ (local storage)
    if (!pictureUrl.includes('/')) {
      const fullUrl = `${this.backendUrl}/uploads/products/${pictureUrl}?t=${Date.now()}`;
      console.log('ImageService - Filename only (local), full URL:', fullUrl);
      return fullUrl;
    }
    
    // Default fallback
    const fallback = 'https://via.placeholder.com/300x300?text=No+Image';
    console.log('ImageService - Default fallback:', fallback);
    return fallback;
  }

  /**
   * Get placeholder image URL
   */
  getPlaceholderUrl(): string {
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }
}
