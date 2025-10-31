import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterConstant } from '../../constants/routerConstants';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Blog Sơn Mài</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá thế giới nghệ thuật sơn mài truyền thống Việt Nam qua những câu chuyện, 
            kỹ thuật và tác phẩm độc đáo
          </p>
        </div>

        <!-- Blog Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Blog Post 1 - Real Blog -->
          <article class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="relative">
              <img src="https://res.cloudinary.com/doez63ydh/image/upload/v1760539378/anh_blog_gj8fp3.jpg" alt="Tranh sơn mài làng Hạ Thái" 
                   class="w-full h-48 object-cover">
              <div class="absolute top-4 left-4">
                <span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Quê hương
                </span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Tranh sơn mài làng Hạ Thái - Hồn quê trong từng nét vẽ</h3>
              <p class="text-gray-600 mb-4">
                Khám phá làng nghề Hạ Thái với hơn 400 năm lịch sử, nơi tạo ra những tác phẩm 
                sơn mài mang đậm hồn quê. Tìm hiểu về kỹ thuật truyền thống và những câu chuyện 
                về cuộc sống bình dị nơi làng quê Việt Nam...
              </p>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">15 tháng 12, 2024</span>
                <a href="/blog/son-mai-truyen-thong" class="text-red-600 hover:text-red-700 font-medium" onclick="window.location.href='/blog/son-mai-truyen-thong'">Đọc thêm →</a>
              </div>
            </div>
          </article>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <a href="#" 
             class="inline-flex items-center px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300">
            <span>Xem tất cả bài viết</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class BlogComponent {
  RouterConstant = RouterConstant;
  
  // Using 5 product images for decoration
  productImages = [
    'https://res.cloudinary.com/doez63ydh/image/upload/v1760023495/04-09-2019-trien-lam-49-tranh-son-mai-truyen-thong-9868AED1_zayzwy.jpg',
    'https://res.cloudinary.com/doez63ydh/image/upload/v1760023495/04-09-2019-trien-lam-49-tranh-son-mai-truyen-thong-9868AED1_zayzwy.jpg',
    'https://res.cloudinary.com/doez63ydh/image/upload/v1760023495/04-09-2019-trien-lam-49-tranh-son-mai-truyen-thong-9868AED1_zayzwy.jpg',
    'https://res.cloudinary.com/doez63ydh/image/upload/v1760023495/04-09-2019-trien-lam-49-tranh-son-mai-truyen-thong-9868AED1_zayzwy.jpg',
    'https://res.cloudinary.com/doez63ydh/image/upload/v1760023495/04-09-2019-trien-lam-49-tranh-son-mai-truyen-thong-9868AED1_zayzwy.jpg'
  ];
}
