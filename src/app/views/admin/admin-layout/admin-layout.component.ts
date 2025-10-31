import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100 font-sans">
      <div class="flex">
        <!-- Sidebar -->
        <nav class="w-64 bg-white shadow-sm min-h-screen">
          <div class="p-4">
            <ul class="space-y-2">
              <li>
                <a 
                  routerLink="/admin/dashboard" 
                  routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors vietnamese-text">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  routerLink="/admin/orders" 
                  routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors vietnamese-text">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Quản lý đơn hàng
                </a>
              </li>
              <li>
                <a 
                  routerLink="/admin/payments" 
                  routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors vietnamese-text">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  Lịch sử giao dịch
                </a>
              </li>
              <li>
              </li>
              <li>
                <a 
                  routerLink="/admin/products" 
                  routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors vietnamese-text">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  Quản lý sản phẩm
                </a>
              </li>
              <li>
                <a 
                  routerLink="/admin/add-product" 
                  routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors vietnamese-text">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Thêm sản phẩm
                </a>
              </li>
              <li>
                <a 
                  routerLink="/admin/statistics" 
                  routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors vietnamese-text">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Thống kê
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-1 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .router-link-active {
      background-color: #eff6ff;
      color: #1d4ed8;
      border-right: 2px solid #1d4ed8;
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    this.router.navigate(['/login']);
  }
}
