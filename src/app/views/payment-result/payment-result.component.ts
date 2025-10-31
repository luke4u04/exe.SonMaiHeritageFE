import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <!-- Success Icon -->
          <div *ngIf="paymentResult?.success" class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <!-- Error Icon -->
          <div *ngIf="!paymentResult?.success" class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>

          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{paymentResult?.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}}
          </h2>
          
          <p class="mt-2 text-center text-sm text-gray-600">
            {{paymentResult?.success ? 'Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.' : 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}}
          </p>
        </div>

        <!-- Payment Details -->
        <div *ngIf="paymentResult" class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Chi tiết giao dịch
            </h3>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Mã đơn hàng</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{paymentResult.orderId}}</dd>
              </div>
              <div *ngIf="paymentResult.transactionId" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Mã giao dịch</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{paymentResult.transactionId}}</dd>
              </div>
              <div *ngIf="paymentResult.bankCode" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Phương thức thanh toán</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span>{{paymentResult.bankCode}}</span>
                </dd>
              </div>
              <div *ngIf="paymentResult.payDate" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Thời gian thanh toán</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{formatDate(paymentResult.payDate)}}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Error Details -->
        <div *ngIf="!paymentResult?.success && errorMessage" class="bg-orange-50 border border-orange-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-orange-800">Lỗi thanh toán</h3>
              <div class="mt-2 text-sm text-orange-700">
                <p>{{errorMessage}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4">
          <button 
            *ngIf="paymentResult?.success"
            (click)="goToOrders()"
            class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Xem đơn hàng
          </button>
          
          <button 
            *ngIf="!paymentResult?.success"
            (click)="retryPayment()"
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Thử lại thanh toán
          </button>
          
          <button 
            (click)="goHome()"
            class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
            Về trang chủ
          </button>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class PaymentResultComponent implements OnInit {
  paymentResult: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.processPaymentResult();
  }

  processPaymentResult() {
    this.route.queryParams.subscribe(params => {
      console.log('Payment result params:', params);
      
      if (params['success'] === 'true') {
        this.paymentResult = {
          success: true,
          orderId: params['orderCode'] || params['orderId'],
          paymentMethod: params['paymentMethod'] || 'PayOS'
        };
      } else {
        this.paymentResult = { success: false };
        this.errorMessage = params['message'] || 'Đơn hàng chưa được xử lý thành công';
      }
    });
  }



  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  goToOrders() {
    this.router.navigate(['/orders']);
  }

  retryPayment() {
    this.router.navigate(['/checkout']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}