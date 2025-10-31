import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Order, OrderStatus } from '../../../interfaces/order.interface';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p class="text-gray-600 mt-2">Xem và quản lý tất cả đơn hàng trong hệ thống</p>
          </div>
          <button 
            (click)="loadOrders()"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Làm mới
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select 
              [(ngModel)]="selectedStatus" 
              (change)="filterByStatus()"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="SHIPPING">Đang giao</option>
              <option value="DELIVERED">Đã giao</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thanh toán</label>
            <select 
              [(ngModel)]="selectedPaymentStatus" 
              (change)="filterByPaymentStatus()"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="PENDING">Chờ thanh toán</option>
              <option value="FAILED">Thanh toán thất bại</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="searchOrders()"
              placeholder="Mã đơn hàng, tên khách hàng, địa chỉ..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
            <select 
              [(ngModel)]="sortBy" 
              (change)="loadOrders()"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="createdDate">Ngày tạo</option>
              <option value="totalAmount">Tổng tiền</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
            <select 
              [(ngModel)]="sortDir" 
              (change)="loadOrders()"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Danh sách đơn hàng ({{totalElements}} đơn hàng)
          </h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of orders" class="hover:bg-gray-100">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{order.orderCode}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900" *ngIf="order.user; else guestUser">
                    {{order.user?.firstName}} {{order.user?.lastName}}
                  </div>
                  <div class="text-sm text-gray-500" *ngIf="order.user">{{order.user?.email}}</div>
                  <ng-template #guestUser>
                    <div class="text-sm text-gray-900">{{order.shipFullName || 'Khách hàng (Guest)'}}</div>
                    <div class="text-sm text-gray-500">{{order.shipPhone || 'N/A'}}</div>
                    <div class="text-xs text-gray-400 mt-1" *ngIf="order.shipWard || order.shipDistrict || order.shipProvince">
                      {{order.shipWard || ''}}{{order.shipWard && order.shipDistrict ? ', ' : ''}}{{order.shipDistrict || ''}}{{order.shipDistrict && order.shipProvince ? ', ' : ''}}{{order.shipProvince || ''}}
                    </div>
                  </ng-template>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{formatCurrency(order.totalAmount)}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getStatusText(order.status)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getPaymentStatusClass(order.paymentStatus)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getPaymentStatusText(order.paymentStatus)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{formatDate(order.orderDate || order.createdDate)}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    (click)="viewOrderDetails(order)"
                    class="text-blue-600 hover:text-blue-900">
                    Xem chi tiết
                  </button>
                  <select 
                    [value]="order.status"
                    (change)="updateOrderStatus(order.id, $event)"
                    class="text-sm border border-gray-300 rounded px-2 py-1">
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="SHIPPING">Đang giao</option>
                    <option value="DELIVERED">Đã giao</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </td>
              </tr>
              <tr *ngIf="orders.length === 0 && !loading">
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              (click)="previousPage()"
              [disabled]="currentPage === 0"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50">
              Trước
            </button>
            <button 
              (click)="nextPage()"
              [disabled]="currentPage >= totalPages - 1"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50">
              Sau
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Hiển thị <span class="font-medium">{{totalElements > 0 ? currentPage * pageSize + 1 : 0}}</span> đến 
                <span class="font-medium">{{Math.min((currentPage + 1) * pageSize, totalElements)}}</span> 
                trong <span class="font-medium">{{totalElements}}</span> kết quả
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  (click)="previousPage()"
                  [disabled]="currentPage === 0"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                  Trước
                </button>
                <button 
                  *ngFor="let page of getPageNumbers()" 
                  (click)="goToPage(page)"
                  [class]="page === currentPage ? 'bg-blue-100 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  {{page + 1}}
                </button>
                <button 
                  (click)="nextPage()"
                  [disabled]="currentPage >= totalPages - 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                  Sau
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div *ngIf="selectedOrder" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeModal()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Chi tiết đơn hàng {{selectedOrder.orderCode}}</h3>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- Customer Info -->
              <div class="bg-gray-100 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                <div *ngIf="selectedOrder.user; else guestCustomerInfo">
                  <p><strong>Loại:</strong> Khách hàng đăng ký</p>
                  <p><strong>Tên:</strong> {{selectedOrder.user?.firstName}} {{selectedOrder.user?.lastName}}</p>
                  <p><strong>Email:</strong> {{selectedOrder.user?.email}}</p>
                  <p><strong>Username:</strong> {{selectedOrder.user?.username}}</p>
                </div>
                <ng-template #guestCustomerInfo>
                  <p><strong>Loại:</strong> Khách hàng (Guest)</p>
                  <p><strong>Tên người nhận:</strong> {{selectedOrder.shipFullName}}</p>
                  <p><strong>Số điện thoại:</strong> {{selectedOrder.shipPhone}}</p>
                </ng-template>
              </div>

              <!-- Shipping Info -->
              <div class="bg-gray-100 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Thông tin giao hàng</h4>
                <p><strong>Người nhận:</strong> {{selectedOrder.shipFullName}}</p>
                <p><strong>Số điện thoại:</strong> {{selectedOrder.shipPhone}}</p>
                <p><strong>Địa chỉ:</strong> {{selectedOrder.shipStreet}}, {{selectedOrder.shipWard}}, {{selectedOrder.shipDistrict}}, {{selectedOrder.shipProvince}}</p>
              </div>

              <!-- Order Items -->
              <div class="bg-gray-100 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Sản phẩm đặt hàng</h4>
                <div class="space-y-2">
                  <div *ngFor="let item of selectedOrder.orderItems" class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div class="flex items-center space-x-3">
                      <img [src]="item.productImage" [alt]="item.productName" class="w-12 h-12 object-cover rounded">
                      <div>
                        <p class="font-medium">{{item.productName}}</p>
                        <p class="text-sm text-gray-600">{{formatCurrency(item.productPrice)}} x {{item.quantity}}</p>
                      </div>
                    </div>
                    <p class="font-medium">{{formatCurrency(item.totalPrice)}}</p>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-bold">Tổng cộng:</span>
                    <span class="text-lg font-bold text-blue-600">{{formatCurrency(selectedOrder.totalAmount)}}</span>
                  </div>
                </div>
              </div>

              <!-- Order Status -->
              <div class="bg-gray-100 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Trạng thái đơn hàng</h4>
                <div class="flex items-center space-x-4">
                  <span [class]="getStatusClass(selectedOrder.status)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                    {{getStatusText(selectedOrder.status)}}
                  </span>
                  <p class="text-sm text-gray-600">
                    Cập nhật lần cuối: {{formatDate(selectedOrder.updatedDate)}}
                  </p>
                </div>
              </div>

              <!-- Payment Status -->
              <div class="bg-gray-100 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Trạng thái thanh toán</h4>
                <div class="flex items-center space-x-4">
                  <span [class]="getPaymentStatusClass(selectedOrder.paymentStatus)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                    {{getPaymentStatusText(selectedOrder.paymentStatus)}}
                  </span>
                  <p class="text-sm text-gray-600">
                    Phương thức: {{selectedOrder.paymentMethod || 'N/A'}}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = false;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  // Filters
  selectedStatus = '';
  selectedPaymentStatus = '';
  searchTerm = '';
  sortBy = 'createdDate';
  sortDir = 'desc';

  Math = Math;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    console.log('Attempting to load orders from API...');
    
    this.adminService.getAllOrders(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        console.log('Orders loaded successfully:', response);
        console.log('Response content:', response.content);
        console.log('Response totalPages:', response.totalPages);
        console.log('Response totalElements:', response.totalElements);
        console.log('Response size:', response.size);
        console.log('Response number:', response.number);
        console.log('Response first:', response.first);
        console.log('Response last:', response.last);
        
        this.orders = response.content || [];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.loading = false;
        
        console.log('Orders array after assignment:', this.orders);
        console.log('Total elements after assignment:', this.totalElements);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        
        // Try to show user-friendly error message
        if (error.status === 0) {
          console.error('Backend is not running or CORS issue');
        } else if (error.status === 401) {
          console.error('Authentication failed');
        } else if (error.status === 404) {
          console.error('API endpoint not found');
        } else if (error.status === 500) {
          console.error('Server error');
        }
        
        this.loading = false;
      }
    });
  }

  filterByStatus() {
    if (this.selectedStatus) {
      this.adminService.getOrdersByStatus(this.selectedStatus).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.totalElements = orders.length;
        },
        error: (error) => {
          console.error('Error filtering orders:', error);
        }
      });
    } else {
      this.loadOrders();
    }
  }

  filterByPaymentStatus() {
    if (this.selectedPaymentStatus) {
      // Filter locally for now, can be moved to backend later
      this.orders = this.orders.filter(order => order.paymentStatus === this.selectedPaymentStatus);
    } else {
      this.loadOrders();
    }
  }


  searchOrders() {
    // Simple client-side search - in production, this should be server-side
    if (this.searchTerm) {
      const filtered = this.orders.filter(order => 
        order.orderCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.user?.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.user?.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        // Search in guest order fields
        order.shipFullName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.shipPhone?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.shipStreet?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.shipWard?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.shipDistrict?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.shipProvince?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.orders = filtered;
    } else {
      this.loadOrders();
    }
  }

  updateOrderStatus(orderId: number, event: any) {
    const newStatus = event.target.value;
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        // Update the order in the list
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        // Reload to revert changes
        this.loadOrders();
      }
    });
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
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

  getPaymentStatusClass(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentStatusText(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'PAID': return 'Đã thanh toán';
      case 'PENDING': return 'Chờ thanh toán';
      case 'FAILED': return 'Thanh toán thất bại';
      case 'CANCELLED': return 'Đã hủy';
      default: return paymentStatus || 'Chưa xác định';
    }
  }
}
