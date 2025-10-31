import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Payment, PaymentStatus } from '../../../interfaces/payment.interface';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Lịch sử giao dịch</h1>
            <p class="text-gray-600 mt-2">Xem và theo dõi tất cả giao dịch thanh toán</p>
          </div>
          <div class="flex space-x-3">
            <button 
              (click)="exportPayments()"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Xuất Excel
            </button>
            <button 
              (click)="loadPayments()"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng giao dịch</p>
              <p class="text-2xl font-semibold text-gray-900">{{totalPayments}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Thành công</p>
              <p class="text-2xl font-semibold text-gray-900">{{successfulPayments}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Thất bại</p>
              <p class="text-2xl font-semibold text-gray-900">{{failedPayments}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng thu</p>
              <p class="text-2xl font-semibold text-gray-900">{{formatCurrency(totalSuccessfulAmount)}}</p>
            </div>
          </div>
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
              <option value="SUCCESS">Thành công</option>
              <option value="FAILED">Thất bại</option>
              <option value="PENDING">Đang chờ</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="searchPayments()"
              placeholder="Mã giao dịch, mã đơn hàng..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
            <input 
              type="date" 
              [(ngModel)]="fromDate"
              (change)="filterByDate()"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
            <input 
              type="date" 
              [(ngModel)]="toDate"
              (change)="filterByDate()"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
            <select 
              [(ngModel)]="sortBy" 
              (change)="loadPayments()"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="createdDate">Ngày tạo</option>
              <option value="amount">Số tiền</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Danh sách giao dịch ({{totalElements}} giao dịch)
          </h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã giao dịch
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
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
              <tr *ngFor="let payment of payments" class="hover:bg-gray-100">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{payment.paymentCode}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{payment.order.orderCode}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900" *ngIf="payment.order.user; else guestPayment">
                    {{payment.order.user?.username}}
                  </div>
                  <div class="text-sm text-gray-500" *ngIf="payment.order.user">{{payment.order.user?.email}}</div>
                  <ng-template #guestPayment>
                    <div class="text-sm text-gray-900">Khách hàng (Guest)</div>
                    <div class="text-sm text-gray-500">{{payment.order.shipFullName}} - {{payment.order.shipPhone}}</div>
                  </ng-template>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{formatCurrency(payment.amount)}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{payment.paymentCode || 'N/A'}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(payment.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getStatusText(payment.status)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{formatDate(payment.createdDate)}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    (click)="viewPaymentDetails(payment)"
                    class="text-blue-600 hover:text-blue-900">
                    Chi tiết
                  </button>
                </td>
              </tr>
              <tr *ngIf="payments.length === 0 && !loading">
                <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy giao dịch nào
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
                Hiển thị <span class="font-medium">{{currentPage * pageSize + 1}}</span> đến 
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

      <!-- Payment Details Modal -->
      <div *ngIf="selectedPayment" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeModal()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Chi tiết giao dịch {{selectedPayment.paymentCode}}</h3>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- Payment Info -->
              <div class="bg-gray-100 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Thông tin giao dịch</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Mã giao dịch:</strong> {{selectedPayment.paymentCode}}</p>
                    <p><strong>Số tiền:</strong> {{formatCurrency(selectedPayment.amount)}}</p>
                    <p><strong>Phương thức:</strong> {{selectedPayment.paymentMethod}}</p>
                  </div>
                  <div>
                    <p><strong>Trạng thái:</strong> 
                      <span [class]="getStatusClass(selectedPayment.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2">
                        {{getStatusText(selectedPayment.status)}}
                      </span>
                    </p>
                    <p><strong>Ngày tạo:</strong> {{formatDate(selectedPayment.createdDate)}}</p>
                    <p><strong>Cập nhật:</strong> {{formatDate(selectedPayment.updatedDate)}}</p>
                  </div>
                </div>
              </div>


              <!-- Order Info -->
              <div class="bg-gray-100 p-4 rounded-lg" *ngIf="selectedPayment.order">
                <h4 class="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Mã đơn hàng:</strong> {{selectedPayment.order.orderCode}}</p>
                    <p><strong>Khách hàng:</strong> {{selectedPayment.order.user?.username || 'N/A'}}</p>
                  </div>
                  <div>
                    <p><strong>Email:</strong> {{selectedPayment.order.user?.email || 'N/A'}}</p>
                  </div>
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
export class AdminPaymentsComponent implements OnInit {
  payments: Payment[] = [];
  selectedPayment: Payment | null = null;
  loading = false;
  
  // Statistics
  totalPayments = 0;
  successfulPayments = 0;
  failedPayments = 0;
  totalSuccessfulAmount = 0;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  // Filters
  selectedStatus = '';
  searchTerm = '';
  fromDate = '';
  toDate = '';
  sortBy = 'createdDate';
  sortDir = 'desc';

  Math = Math;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadPayments();
    this.loadStatistics();
  }

  loadPayments() {
    this.loading = true;
    this.adminService.getAllPayments(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        this.payments = response.content || [];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  loadStatistics() {
    this.adminService.getPaymentStatistics().subscribe({
      next: (stats) => {
        this.totalPayments = stats.totalPayments;
        this.successfulPayments = stats.successfulPayments;
        this.failedPayments = stats.failedPayments;
        this.totalSuccessfulAmount = stats.successfulAmount;
      },
      error: (error) => {
        console.error('Error loading payment statistics:', error);
      }
    });
  }

  filterByStatus() {
    if (this.selectedStatus) {
      this.adminService.getPaymentsByStatus(this.selectedStatus).subscribe({
        next: (payments) => {
          this.payments = payments;
          this.totalElements = payments.length;
        },
        error: (error) => {
          console.error('Error filtering payments:', error);
        }
      });
    } else {
      this.loadPayments();
    }
  }

  searchPayments() {
    // Simple client-side search - in production, this should be server-side
    if (this.searchTerm) {
      const filtered = this.payments.filter(payment => 
        payment.paymentCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.order?.orderCode?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.payments = filtered;
    } else {
      this.loadPayments();
    }
  }

  filterByDate() {
    // In production, this should be server-side filtering
    if (this.fromDate || this.toDate) {
      let filtered = [...this.payments];
      
      if (this.fromDate) {
        const from = new Date(this.fromDate);
        filtered = filtered.filter(payment => new Date(payment.createdDate) >= from);
      }
      
      if (this.toDate) {
        const to = new Date(this.toDate);
        to.setHours(23, 59, 59, 999); // End of day
        filtered = filtered.filter(payment => new Date(payment.createdDate) <= to);
      }
      
      this.payments = filtered;
      this.totalElements = filtered.length;
    } else {
      this.loadPayments();
    }
  }

  viewPaymentDetails(payment: Payment) {
    this.selectedPayment = payment;
  }


  exportPayments() {
    // In production, this would export to Excel
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'payments.csv');
  }

  generateCSV(): string {
    const headers = ['Mã giao dịch', 'Mã đơn hàng', 'Khách hàng', 'Số tiền', 'Trạng thái', 'Ngày tạo'];
    const rows = this.payments.map(payment => [
      payment.paymentCode,
      payment.order?.orderCode || '',
      payment.order?.user?.username || '',
      payment.amount.toString(),
      this.getStatusText(payment.status),
      this.formatDate(payment.createdDate)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  closeModal() {
    this.selectedPayment = null;
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPayments();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPayments();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadPayments();
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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'SUCCESS': return 'Thành công';
      case 'FAILED': return 'Thất bại';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }
}
