import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Tra cứu đơn hàng</h1>
          <p class="text-gray-600">Nhập mã đơn hàng để xem thông tin chi tiết</p>
        </div>

        <!-- Search Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <form (ngSubmit)="lookupOrder()" class="max-w-md mx-auto">
            <div class="mb-4">
              <label for="orderCode" class="block text-sm font-medium text-gray-700 mb-2">
                Mã đơn hàng
              </label>
              <input
                type="text"
                id="orderCode"
                name="orderCode"
                [(ngModel)]="orderCode"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mã đơn hàng (ví dụ: ORD123456)"
              >
            </div>
            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Đang tìm kiếm...' : 'Tra cứu đơn hàng' }}
            </button>
          </form>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div *ngIf="orderDetails" class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Order Header -->
          <div class="bg-blue-50 px-6 py-4 border-b">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Đơn hàng #{{ orderDetails.orderCode }}</h2>
                <p class="text-sm text-gray-600">Ngày đặt: {{ formatDate(orderDetails.createdAt) }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      [class]="getStatusClass(orderDetails.status)">
                  {{ getStatusText(orderDetails.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Order Content -->
          <div class="p-6">
            <!-- Customer Info (Masked) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div class="space-y-2">
                  <p class="text-sm"><span class="font-medium">Họ tên:</span> {{ maskName(orderDetails.shipName) }}</p>
                  <p class="text-sm"><span class="font-medium">Số điện thoại:</span> {{ maskPhone(orderDetails.shipPhone) }}</p>
                  <p class="text-sm"><span class="font-medium">Email:</span> {{ maskEmail(orderDetails.shipEmail) }}</p>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Địa chỉ giao hàng</h3>
                <div class="text-sm text-gray-700">
                  <p>{{ maskAddress(orderDetails.shipStreet) }}</p>
                  <p>{{ orderDetails.shipWard }}, {{ orderDetails.shipDistrict }}</p>
                  <p>{{ orderDetails.shipProvince }}</p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let item of orderDetails.orderItems">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-16 w-16">
                            <img [src]="item.productImage" [alt]="item.productName" class="h-16 w-16 object-cover rounded-md">
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ item.productName }}</div>
                            <div class="text-sm text-gray-500">SKU: {{ item.productSku }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.quantity }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.price) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="border-t pt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                <span class="text-xl font-bold text-blue-600">{{ formatCurrency(orderDetails.totalAmount) }}</span>
              </div>
            </div>

            <!-- Note -->
            <div *ngIf="orderDetails.note" class="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 class="font-medium text-gray-900 mb-2">Ghi chú:</h4>
              <p class="text-sm text-gray-700">{{ orderDetails.note }}</p>
            </div>

            <!-- Email Notification -->
            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-blue-800">Thông tin chi tiết đã được gửi qua email</h4>
                  <p class="mt-1 text-sm text-blue-700">
                    Để xem thông tin đầy đủ và chi tiết về đơn hàng, vui lòng kiểm tra email 
                    <strong>{{ maskEmail(orderDetails.shipEmail) }}</strong> mà chúng tôi đã gửi khi đặt hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="showNoResults" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
          <p class="mt-1 text-sm text-gray-500">Vui lòng kiểm tra lại mã đơn hàng</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrderLookupComponent implements OnInit {
  orderCode: string = '';
  orderDetails: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  showNoResults: boolean = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {}

  lookupOrder(): void {
    if (!this.orderCode.trim()) {
      this.errorMessage = 'Vui lòng nhập mã đơn hàng';
      return;
    }

    // Ngăn chặn gửi request nhiều lần
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showNoResults = false;
    this.orderDetails = null;

    this.orderService.lookupOrder(this.orderCode.trim()).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.orderDetails = response;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.showNoResults = true;
        } else {
          this.errorMessage = 'Có lỗi xảy ra khi tra cứu đơn hàng. Vui lòng thử lại.';
        }
      }
    });
  }

  // Masking functions for privacy
  maskName(name: string): string {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0) + '*'.repeat(words[0].length - 1);
    }
    return words[0] + ' ' + words[words.length - 1].charAt(0) + '*'.repeat(words[words.length - 1].length - 1);
  }

  maskPhone(phone: string): string {
    if (!phone) return '';
    if (phone.length <= 3) return phone;
    return '*'.repeat(phone.length - 3) + phone.slice(-3);
  }

  maskEmail(email: string): string {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return local.charAt(0) + '*'.repeat(local.length - 2) + local.slice(-1) + '@' + domain;
  }

  maskAddress(address: string): string {
    if (!address) return '';
    if (address.length <= 5) return address;
    return address.slice(0, 3) + '*'.repeat(address.length - 6) + address.slice(-3);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PROCESSING': return 'Đang xử lý';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return 'Không xác định';
    }
  }
}
