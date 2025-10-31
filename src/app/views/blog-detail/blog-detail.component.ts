import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-4xl mx-auto px-4 py-8">
          <div class="flex items-center space-x-4 mb-6">
            <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <span class="text-sm text-gray-500">Blog / Tranh sơn mài Hạ Thái</span>
          </div>
          
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Tranh sơn mài làng Hạ Thái - Hồn quê trong từng nét vẽ</h1>
            <div class="flex items-center justify-center space-x-4 text-gray-600">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                Admin
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                15 tháng 12, 2024
              </span>
              <span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Quê hương
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 py-8">
        <article class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Featured Image -->
          <div class="relative">
            <img src="https://res.cloudinary.com/doez63ydh/image/upload/v1760539378/anh_blog_gj8fp3.jpg" 
                 alt="Tranh sơn mài làng Hạ Thái" 
                 class="w-full h-96 object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-20" 
                 style="background-image: url('https://res.cloudinary.com/doez63ydh/image/upload/v1760539378/anh_blog_gj8fp3.jpg'); background-size: cover; background-position: center; opacity: 0.3;"></div>
          </div>

          <!-- Article Content -->
          <div class="p-8">
            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 leading-relaxed mb-6">
                Làng Hạ Thái, thuộc xã Duyên Thái, huyện Thường Tín, Hà Nội, là một trong những cái nôi 
                của nghề sơn mài truyền thống Việt Nam. Với hơn 400 năm lịch sử, làng Hạ Thái đã tạo ra 
                những tác phẩm sơn mài mang đậm hồn quê, phản ánh cuộc sống bình dị của người dân Việt Nam.
              </p>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Lịch sử làng nghề Hạ Thái</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                Làng Hạ Thái được hình thành từ thế kỷ 16, khi những người thợ sơn mài từ các vùng khác 
                đến định cư và truyền nghề. Qua nhiều thế hệ, làng đã phát triển thành một trung tâm 
                sơn mài nổi tiếng với những tác phẩm mang đậm bản sắc văn hóa địa phương.
              </p>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Đặc trưng nghệ thuật</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                Tranh sơn mài Hạ Thái nổi tiếng với những chủ đề gần gũi với đời sống nông thôn: 
                cảnh đồng quê, làng xóm, cây đa, bến nước, con đò, hay những hình ảnh sinh hoạt 
                hàng ngày của người dân. Mỗi tác phẩm đều thấm đẫm tình yêu quê hương, đất nước.
              </p>

              <div class="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
                <h3 class="text-lg font-semibold text-amber-800 mb-2">Hồn quê trong từng nét vẽ</h3>
                <p class="text-amber-700">
                  Các nghệ nhân Hạ Thái không chỉ tạo ra những tác phẩm đẹp mắt, mà còn gửi gắm 
                  tình cảm sâu sắc về quê hương, về những kỷ niệm tuổi thơ, về cuộc sống bình dị 
                  nơi làng quê Việt Nam.
                </p>
              </div>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Kỹ thuật đặc biệt</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                Nghệ nhân Hạ Thái sử dụng kỹ thuật sơn mài truyền thống kết hợp với khảm trai, 
                tạo ra những hiệu ứng ánh sáng đa chiều. Đặc biệt, họ thường sử dụng màu sắc 
                ấm áp, gần gũi như màu vàng của lúa chín, màu xanh của lá cây, màu đỏ của hoa gạo.
              </p>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Chủ đề phổ biến</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                Tranh sơn mài Hạ Thái thường tập trung vào những chủ đề:
              </p>
              
              <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Cảnh làng quê:</strong> Đồng lúa, cây đa, bến nước, con đò</li>
                <li><strong>Sinh hoạt dân gian:</strong> Hội làng, đám cưới, lễ hội truyền thống</li>
                <li><strong>Phong cảnh thiên nhiên:</strong> Sông nước, núi non, cây cối</li>
                <li><strong>Động vật quen thuộc:</strong> Trâu, bò, gà, vịt, chim chóc</li>
                <li><strong>Con người:</strong> Người nông dân, trẻ em, phụ nữ làng quê</li>
              </ul>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Giá trị văn hóa</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                Tranh sơn mài Hạ Thái không chỉ là tác phẩm nghệ thuật, mà còn là cầu nối 
                giữa quá khứ và hiện tại, giữa truyền thống và hiện đại. Mỗi bức tranh đều 
                kể một câu chuyện về cuộc sống, về con người, về tình yêu quê hương đất nước.
              </p>

              <p class="text-gray-700 leading-relaxed mb-8">
                Ngày nay, tranh sơn mài Hạ Thái vẫn được nhiều người yêu thích và tìm mua. 
                Không chỉ là món quà lưu niệm, những tác phẩm này còn là cách để mỗi người 
                giữ gìn và truyền lại tình yêu quê hương cho thế hệ sau.
              </p>
            </div>

            <!-- Tags -->
            <div class="border-t pt-6 mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Hạ Thái</span>
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Làng nghề</span>
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Quê hương</span>
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Tranh sơn mài</span>
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Văn hóa</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Related Articles -->
        <div class="mt-12">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src="https://res.cloudinary.com/doez63ydh/image/upload/v1760539378/anh_blog_gj8fp3.jpg" 
                   alt="Làng nghề truyền thống" class="w-full h-48 object-cover">
              <div class="p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Làng nghề sơn mài truyền thống</h4>
                <p class="text-gray-600 text-sm">Khám phá các làng nghề sơn mài nổi tiếng khác...</p>
              </div>
            </article>
            
            <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src="https://res.cloudinary.com/doez63ydh/image/upload/v1760539378/anh_blog_gj8fp3.jpg" 
                   alt="Văn hóa làng quê" class="w-full h-48 object-cover">
              <div class="p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Văn hóa làng quê Việt Nam</h4>
                <p class="text-gray-600 text-sm">Tìm hiểu về văn hóa và đời sống làng quê...</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BlogDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get blog ID from route params if needed
    this.route.params.subscribe(params => {
      console.log('Blog ID:', params['id']);
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}