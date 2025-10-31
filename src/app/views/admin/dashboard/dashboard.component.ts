import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { OrderStatistics } from '../../../interfaces/order.interface';
import { PaymentStatistics } from '../../../interfaces/payment.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2">Tổng quan hệ thống Son Mai Heritage</p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p class="text-2xl font-semibold text-gray-900">{{orderStats?.totalOrders || 0}}</p>
            </div>
          </div>
        </div>

        <!-- Paid Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Đã thanh toán</p>
              <p class="text-2xl font-semibold text-gray-900">{{orderStats?.paidOrders || 0}}</p>
            </div>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Đang chờ</p>
              <p class="text-2xl font-semibold text-gray-900">{{orderStats?.pendingOrders || 0}}</p>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p class="text-2xl font-semibold text-gray-900">{{formatCurrency(orderStats?.totalRevenue || 0)}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Payments -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng giao dịch</p>
              <p class="text-2xl font-semibold text-gray-900">{{paymentStats?.totalPayments || 0}}</p>
            </div>
          </div>
        </div>

        <!-- Successful Payments -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Thành công</p>
              <p class="text-2xl font-semibold text-gray-900">{{paymentStats?.successfulPayments || 0}}</p>
            </div>
          </div>
        </div>

        <!-- Failed Payments -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Thất bại</p>
              <p class="text-2xl font-semibold text-gray-900">{{paymentStats?.failedPayments || 0}}</p>
            </div>
          </div>
        </div>

        <!-- Successful Amount -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3-3-3h1.5a3 3 0 110-6H9zm-1 0V6a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Số tiền thành công</p>
              <p class="text-2xl font-semibold text-gray-900">{{formatCurrency(paymentStats?.successfulAmount || 0)}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div class="p-6">
            <div *ngIf="recentOrders.length === 0" class="text-center text-gray-500 py-8">
              Chưa có đơn hàng nào
            </div>
            <div *ngFor="let order of recentOrders" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p class="font-medium text-gray-900">{{order.orderCode}}</p>
                <p class="text-sm text-gray-600">{{order.user?.firstName}} {{order.user?.lastName}}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">{{formatCurrency(order.totalAmount)}}</p>
                <span [class]="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{getStatusText(order.status)}}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Payments -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Giao dịch gần đây</h3>
          </div>
          <div class="p-6">
            <div *ngIf="recentPayments.length === 0" class="text-center text-gray-500 py-8">
              Chưa có giao dịch nào
            </div>
            <div *ngFor="let payment of recentPayments" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p class="font-medium text-gray-900">{{payment.paymentCode}}</p>
                <p class="text-sm text-gray-600">{{payment.order?.orderCode}}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">{{formatCurrency(payment.amount)}}</p>
                <span [class]="getPaymentStatusClass(payment.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{getPaymentStatusText(payment.status)}}
                </span>
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
export class AdminDashboardComponent implements OnInit {
  orderStats: OrderStatistics | null = null;
  paymentStats: PaymentStatistics | null = null;
  recentOrders: any[] = [];
  recentPayments: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load statistics
    this.adminService.getOrderStatistics().subscribe({
      next: (stats) => {
        this.orderStats = stats;
      },
      error: (error) => {
        console.error('Error loading order statistics:', error);
      }
    });

    this.adminService.getPaymentStatistics().subscribe({
      next: (stats) => {
        this.paymentStats = stats;
      },
      error: (error) => {
        console.error('Error loading payment statistics:', error);
      }
    });

    // Load recent orders
    this.adminService.getAllOrders(0, 5).subscribe({
      next: (response) => {
        this.recentOrders = response.content || [];
      },
      error: (error) => {
        console.error('Error loading recent orders:', error);
      }
    });

    // Load recent payments
    this.adminService.getAllPayments(0, 5).subscribe({
      next: (response) => {
        this.recentPayments = response.content || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent payments:', error);
        this.loading = false;
      }
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

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'SUCCESS': return 'Thành công';
      case 'FAILED': return 'Thất bại';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }
}

