import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white shadow rounded-lg p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">API Test - Kiểm tra Backend</h1>
          
          <!-- Test Create Order -->
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 class="text-lg font-medium text-blue-900 mb-4">Test Tạo Đơn Hàng</h3>
            <button 
              (click)="testCreateOrder()"
              [disabled]="isLoading"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
              <span *ngIf="!isLoading">Tạo đơn hàng test</span>
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo...
              </span>
            </button>
          </div>

          <!-- Test Results -->
          <div *ngIf="createResult" class="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 class="text-lg font-medium text-green-900 mb-4">Kết quả tạo đơn hàng</h3>
            <div class="text-sm text-green-700">
              <p><strong>Trạng thái:</strong> {{createResult.success ? 'Thành công' : 'Thất bại'}}</p>
              <p *ngIf="createResult.message"><strong>Thông báo:</strong> {{createResult.message}}</p>
              <p *ngIf="createResult.orderCode"><strong>Mã đơn hàng:</strong> {{createResult.orderCode}}</p>
            </div>
          </div>

          <!-- Test Load Orders -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h3 class="text-lg font-medium text-yellow-900 mb-4">Test Load Đơn Hàng</h3>
            <button 
              (click)="testLoadOrders()"
              [disabled]="isLoading"
              class="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50">
              <span *ngIf="!isLoading">Load danh sách đơn hàng</span>
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tải...
              </span>
            </button>
          </div>

          <!-- Load Results -->
          <div *ngIf="loadResult" class="bg-purple-50 border border-purple-200 rounded-md p-4 mb-6">
            <h3 class="text-lg font-medium text-purple-900 mb-4">Kết quả load đơn hàng</h3>
            <div class="text-sm text-purple-700">
              <p><strong>Số lượng đơn hàng:</strong> {{loadResult.count}}</p>
              <p><strong>Trạng thái:</strong> {{loadResult.success ? 'Thành công' : 'Thất bại'}}</p>
              <p *ngIf="loadResult.message"><strong>Thông báo:</strong> {{loadResult.message}}</p>
            </div>
          </div>

          <!-- Orders List -->
          <div *ngIf="orders.length > 0" class="bg-white border border-gray-200 rounded-md">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Danh sách đơn hàng ({{orders.length}} đơn)</h3>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div *ngFor="let order of orders" class="p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h4 class="text-sm font-medium text-gray-900">{{order.orderCode}}</h4>
                      <span [class]="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{getStatusText(order.status)}}
                      </span>
                    </div>
                    
                    <div class="text-sm text-gray-600 space-y-1">
                      <p><strong>Khách hàng:</strong> {{order.shipFullName || 'N/A'}}</p>
                      <p><strong>SĐT:</strong> {{order.shipPhone || 'N/A'}}</p>
                      <p><strong>Tổng tiền:</strong> {{formatCurrency(order.totalAmount)}}</p>
                      <p><strong>Ngày tạo:</strong> {{formatDate(order.createdDate)}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- API Status -->
          <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Trạng thái API</h3>
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Backend URL:</strong> {{backendUrl}}</p>
              <p><strong>Trạng thái:</strong> {{apiStatus}}</p>
              <p *ngIf="lastError"><strong>Lỗi cuối:</strong> {{lastError}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ApiTestComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;
  createResult: any = null;
  loadResult: any = null;
  backendUrl = 'http://localhost:8081';
  apiStatus = 'Chưa kiểm tra';
  lastError = '';

  constructor(
    private adminService: AdminService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.testLoadOrders();
  }

  testCreateOrder() {
    this.isLoading = true;
    this.createResult = null;

    // Tạo dữ liệu test đơn hàng
    const testOrderData = {
      orderCode: 'TEST_API_' + Date.now(),
      userId: null, // Guest order
      items: [
        {
          productId: 1,
          productName: 'Sản phẩm test API',
          productPrice: 100000,
          quantity: 1,
          productImage: 'https://via.placeholder.com/150'
        }
      ],
      totalAmount: 100000,
      note: 'Test từ API component',
      shipFullName: 'Nguyễn Văn Test API',
      shipPhone: '0987654321',
      shipEmail: 'test@example.com',
      shipStreet: '456 Đường Test API',
      shipWard: 'Phường Test API',
      shipDistrict: 'Quận Test API',
      shipProvince: 'TP. Test API',
      paymentMethod: 'MOCK_PAYMENT',
      paymentStatus: 'SUCCESS',
      orderDate: new Date().toISOString(),
      status: 'PENDING'
    };

    console.log('Testing create order with data:', testOrderData);

    this.checkoutService.processCheckout(testOrderData).subscribe({
      next: (response) => {
        console.log('Create order success:', response);
        this.createResult = {
          success: true,
          message: 'Đơn hàng đã được tạo thành công',
          orderCode: testOrderData.orderCode
        };
        this.apiStatus = 'API hoạt động bình thường';
        this.isLoading = false;
        
        // Reload orders list
        this.testLoadOrders();
      },
      error: (error) => {
        console.error('Create order error:', error);
        this.createResult = {
          success: false,
          message: 'Lỗi khi tạo đơn hàng: ' + (error.message || error)
        };
        this.apiStatus = 'API có lỗi';
        this.lastError = error.message || error;
        this.isLoading = false;
      }
    });
  }

  testLoadOrders() {
    this.isLoading = true;
    this.loadResult = null;

    this.adminService.getAllOrders(0, 10, 'createdDate', 'desc').subscribe({
      next: (response) => {
        console.log('Load orders success:', response);
        this.orders = response.content || [];
        this.loadResult = {
          success: true,
          count: this.orders.length,
          message: `Đã load ${this.orders.length} đơn hàng`
        };
        this.apiStatus = 'API hoạt động bình thường';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Load orders error:', error);
        this.loadResult = {
          success: false,
          count: 0,
          message: 'Lỗi khi load đơn hàng: ' + (error.message || error)
        };
        this.apiStatus = 'API có lỗi';
        this.lastError = error.message || error;
        this.isLoading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (error) {
      return 'Invalid Date';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPING': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPING': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }
}
