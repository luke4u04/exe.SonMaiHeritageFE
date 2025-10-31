import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-order-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white shadow rounded-lg p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Debug Đơn Hàng - Kiểm tra thông tin khách hàng</h1>
          
          <!-- Debug Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 class="text-lg font-medium text-blue-900 mb-4">Thông tin debug</h3>
            <div class="text-sm text-blue-700">
              <p><strong>Mục đích:</strong> Kiểm tra xem dữ liệu đơn hàng có được lưu đúng không</p>
              <p><strong>Kiểm tra:</strong> Tên khách hàng, SĐT, địa chỉ có hiển thị đúng không</p>
            </div>
          </div>

          <!-- Orders List -->
          <div class="bg-white border border-gray-200 rounded-md">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Danh sách đơn hàng (Debug)</h3>
            </div>
            
            <div *ngIf="orders.length === 0 && !isLoading" class="p-6 text-center text-gray-500">
              Không có đơn hàng nào
            </div>
            
            <div *ngIf="isLoading" class="p-6 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-500">Đang tải...</p>
            </div>

            <div *ngIf="orders.length > 0" class="divide-y divide-gray-200">
              <div *ngFor="let order of orders; let i = index" class="p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h4 class="text-sm font-medium text-gray-900">{{order.orderCode}}</h4>
                      <span [class]="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{getStatusText(order.status)}}
                      </span>
                    </div>
                    
                    <!-- Debug: Raw Data -->
                    <div class="bg-gray-50 p-3 rounded mb-3">
                      <h5 class="text-xs font-medium text-gray-700 mb-2">Raw Data (Debug):</h5>
                      <pre class="text-xs text-gray-600 overflow-x-auto">{{getOrderDebugInfo(order)}}</pre>
                    </div>
                    
                    <!-- Thông tin khách hàng -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Thông tin khách hàng:</h5>
                        <div class="text-sm text-gray-600 space-y-1">
                          <p><strong>Tên:</strong> {{order.shipFullName || 'N/A'}}</p>
                          <p><strong>SĐT:</strong> {{order.shipPhone || 'N/A'}}</p>
                          <p><strong>User ID:</strong> {{order.user?.id || 'Guest (null)'}}</p>
                          <p><strong>Username:</strong> {{order.user?.username || 'N/A'}}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng:</h5>
                        <div class="text-sm text-gray-600 space-y-1">
                          <p><strong>Đường:</strong> {{order.shipStreet || 'N/A'}}</p>
                          <p><strong>Phường/Xã:</strong> {{order.shipWard || 'N/A'}}</p>
                          <p><strong>Quận/Huyện:</strong> {{order.shipDistrict || 'N/A'}}</p>
                          <p><strong>Tỉnh/TP:</strong> {{order.shipProvince || 'N/A'}}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Thông tin đơn hàng -->
                    <div class="mt-3 pt-3 border-t border-gray-200">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p><strong>Tổng tiền:</strong> {{formatCurrency(order.totalAmount)}}</p>
                          <p><strong>Ngày tạo:</strong> {{formatDate(order.createdDate)}}</p>
                        </div>
                        <div>
                          <p><strong>Phương thức TT:</strong> {{order.paymentMethod || 'N/A'}}</p>
                          <p><strong>Trạng thái TT:</strong> {{order.paymentStatus || 'N/A'}}</p>
                        </div>
                        <div>
                          <p><strong>Ghi chú:</strong> {{order.note || 'Không có'}}</p>
                        </div>
                      </div>
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
export class OrderDebugComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    
    this.adminService.getAllOrders(0, 10, 'createdDate', 'desc').subscribe({
      next: (response) => {
        this.orders = response.content || [];
        this.isLoading = false;
        console.log('Debug - Orders loaded:', this.orders);
        
        // Debug: Log chi tiết từng đơn hàng
        this.orders.forEach((order, index) => {
          console.log(`Order ${index + 1}:`, {
            orderCode: order.orderCode,
            shipFullName: order.shipFullName,
            shipPhone: order.shipPhone,
            shipStreet: order.shipStreet,
            shipWard: order.shipWard,
            shipDistrict: order.shipDistrict,
            shipProvince: order.shipProvince,
            user: order.user,
            totalAmount: order.totalAmount,
            status: order.status,
            createdDate: order.createdDate
          });
        });
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  getOrderDebugInfo(order: any): string {
    return JSON.stringify({
      orderCode: order.orderCode,
      shipFullName: order.shipFullName,
      shipPhone: order.shipPhone,
      shipStreet: order.shipStreet,
      shipWard: order.shipWard,
      shipDistrict: order.shipDistrict,
      shipProvince: order.shipProvince,
      user: order.user,
      totalAmount: order.totalAmount,
      status: order.status,
      createdDate: order.createdDate,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      note: order.note
    }, null, 2);
  }

  viewOrderDetails(order: any) {
    const details = `
Chi tiết đơn hàng ${order.orderCode}:

THÔNG TIN KHÁCH HÀNG:
- Tên: ${order.shipFullName || 'N/A'}
- SĐT: ${order.shipPhone || 'N/A'}
- User ID: ${order.user?.id || 'Guest (null)'}
- Username: ${order.user?.username || 'N/A'}

ĐỊA CHỈ GIAO HÀNG:
- Đường: ${order.shipStreet || 'N/A'}
- Phường/Xã: ${order.shipWard || 'N/A'}
- Quận/Huyện: ${order.shipDistrict || 'N/A'}
- Tỉnh/TP: ${order.shipProvince || 'N/A'}

THÔNG TIN ĐƠN HÀNG:
- Tổng tiền: ${this.formatCurrency(order.totalAmount)}
- Ngày tạo: ${this.formatDate(order.createdDate)}
- Phương thức TT: ${order.paymentMethod || 'N/A'}
- Trạng thái TT: ${order.paymentStatus || 'N/A'}
- Ghi chú: ${order.note || 'Không có'}
    `;
    
    console.log('Order details:', details);
    alert(details);
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
