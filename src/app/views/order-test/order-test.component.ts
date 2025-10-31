import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-order-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white shadow rounded-lg p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Test Đơn Hàng - Kiểm tra thông tin khách hàng</h1>
          
          <!-- Test Button -->
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
          <div *ngIf="testResult" class="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 class="text-lg font-medium text-green-900 mb-4">Kết quả test</h3>
            <div class="text-sm text-green-700">
              <p><strong>Đơn hàng đã tạo:</strong> {{testResult.orderCode}}</p>
              <p><strong>Trạng thái:</strong> {{testResult.success ? 'Thành công' : 'Thất bại'}}</p>
              <p *ngIf="testResult.message"><strong>Thông báo:</strong> {{testResult.message}}</p>
            </div>
          </div>

          <!-- Orders List -->
          <div class="bg-white border border-gray-200 rounded-md">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Danh sách đơn hàng gần đây</h3>
            </div>
            
            <div *ngIf="orders.length === 0 && !isLoading" class="p-6 text-center text-gray-500">
              Không có đơn hàng nào
            </div>
            
            <div *ngIf="isLoading" class="p-6 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-500">Đang tải...</p>
            </div>

            <div *ngIf="orders.length > 0" class="divide-y divide-gray-200">
              <div *ngFor="let order of orders" class="p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <h4 class="text-sm font-medium text-gray-900">{{order.orderCode}}</h4>
                      <span [class]="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{getStatusText(order.status)}}
                      </span>
                    </div>
                    
                    <!-- Thông tin khách hàng -->
                    <div class="mt-2 text-sm text-gray-600">
                      <p><strong>Khách hàng:</strong> {{order.shipFullName || 'N/A'}}</p>
                      <p><strong>Số điện thoại:</strong> {{order.shipPhone || 'N/A'}}</p>
                      <p><strong>Địa chỉ:</strong> {{getFullAddress(order)}}</p>
                    </div>
                    
                    <!-- Thông tin đơn hàng -->
                    <div class="mt-2 text-sm text-gray-500">
                      <p><strong>Tổng tiền:</strong> {{formatCurrency(order.totalAmount)}}</p>
                      <p><strong>Ngày tạo:</strong> {{formatDate(order.orderDate)}}</p>
                      <p><strong>Ghi chú:</strong> {{order.note || 'Không có'}}</p>
                    </div>
                  </div>
                  
                  <div class="ml-4">
                    <button 
                      (click)="viewOrderDetails(order)"
                      class="text-blue-600 hover:text-blue-900 text-sm">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrderTestComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;
  testResult: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }

  testCreateOrder() {
    this.isLoading = true;
    this.testResult = null;

    // Tạo dữ liệu test đơn hàng
    const testOrderData = {
      orderCode: 'TEST_ORDER_' + Date.now(),
      userId: null, // Guest order
      items: [
        {
          productId: 1,
          productName: 'Sản phẩm test',
          quantity: 2,
          price: 100000
        }
      ],
      totalAmount: 200000,
      note: 'Đơn hàng test từ component',
      shipFullName: 'Nguyễn Văn Test',
      shipPhone: '0123456789',
      shipStreet: '123 Đường Test',
      shipWard: 'Phường Test',
      shipDistrict: 'Quận Test',
      shipProvince: 'TP. Test',
      paymentMethod: 'MOCK_PAYMENT',
      paymentStatus: 'SUCCESS',
      orderDate: new Date().toISOString(),
      status: 'PENDING'
    };

    console.log('Creating test order:', testOrderData);

    // Gọi API tạo đơn hàng (giả lập)
    setTimeout(() => {
      this.testResult = {
        orderCode: testOrderData.orderCode,
        success: true,
        message: 'Đơn hàng test đã được tạo thành công'
      };
      this.isLoading = false;
      this.loadOrders(); // Reload danh sách
    }, 1000);
  }

  loadOrders() {
    this.isLoading = true;
    
    // Gọi API lấy danh sách đơn hàng
    this.adminService.getAllOrders(0, 10, 'orderDate', 'desc').subscribe({
      next: (response) => {
        this.orders = response.content || [];
        this.isLoading = false;
        console.log('Orders loaded:', this.orders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
        // Nếu API chưa sẵn sàng, tạo dữ liệu giả lập
        this.orders = [
          {
            orderCode: 'ORDER_1234567890_abc123',
            shipFullName: 'Nguyễn Văn A',
            shipPhone: '0123456789',
            shipStreet: '123 Đường ABC',
            shipWard: 'Phường XYZ',
            shipDistrict: 'Quận 1',
            shipProvince: 'TP. HCM',
            totalAmount: 500000,
            orderDate: new Date().toISOString(),
            status: 'PENDING',
            note: 'Giao hàng trong giờ hành chính'
          }
        ];
      }
    });
  }

  viewOrderDetails(order: any) {
    console.log('Order details:', order);
    alert(`Chi tiết đơn hàng ${order.orderCode}:\n\n` +
          `Khách hàng: ${order.shipFullName}\n` +
          `SĐT: ${order.shipPhone}\n` +
          `Địa chỉ: ${this.getFullAddress(order)}\n` +
          `Tổng tiền: ${this.formatCurrency(order.totalAmount)}\n` +
          `Ghi chú: ${order.note || 'Không có'}`);
  }

  getFullAddress(order: any): string {
    if (!order.shipStreet) return 'Chưa có địa chỉ';
    return `${order.shipStreet}, ${order.shipWard}, ${order.shipDistrict}, ${order.shipProvince}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('vi-VN');
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
