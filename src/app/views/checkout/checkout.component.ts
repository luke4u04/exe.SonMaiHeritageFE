import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutService, CheckoutRequest } from '../../services/checkout.service';
import { AuthService } from '../../services/auth.service';
import { PayOSService } from '../../services/payos.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  checkoutService = inject(CheckoutService);
  authService = inject(AuthService);
  payOSService = inject(PayOSService);
  router = inject(Router);

  // Form data
  shippingInfo = {
    fullName: '',
    phone: '',
    email: '',
    street: '',
    ward: '',
    district: '',
    province: ''
  };
  
  note = '';
  isProcessing = false;
  currentUser: any = null;

  // Computed properties
  get cartItems(): CartItem[] {
    return this.cartService.getCartItems()();
  }

  get totalPrice(): number {
    return this.cartService.getCartTotal()();
  }

  get shippingFee(): number {
    return 0; // Free shipping
  }

  get finalTotal(): number {
    return this.totalPrice + this.shippingFee;
  }

  // Payment method selection
  selectedPaymentMethod: string = 'payos';

  ngOnInit() {
    console.log('Checkout component initialized');
    
    // Check if user is logged in (optional for guest checkout)
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user:', this.currentUser);

    // Check if cart is empty
    console.log('Cart items:', this.cartItems);
    if (this.cartItems.length === 0) {
      console.log('Cart is empty, redirecting to cart');
      this.router.navigate(['/cart']);
      return;
    }

    // Pre-fill user info if available (for logged in users)
    if (this.currentUser) {
      this.shippingInfo.fullName = (this.currentUser.firstName || '') + ' ' + (this.currentUser.lastName || '');
      this.shippingInfo.phone = this.currentUser.phone || '';
      this.shippingInfo.email = this.currentUser.email || '';
      console.log('Pre-filled shipping info:', this.shippingInfo);
    }
  }

  onSubmit() {
    console.log('Submit button clicked'); // Debug log
    
    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;
    console.log('Processing checkout...'); // Debug log
    console.log('Selected payment method:', this.selectedPaymentMethod); // Debug log

    if (this.selectedPaymentMethod === 'payos') {
      console.log('Processing PayOS checkout...'); // Debug log
      this.processPayOSCheckout();
    } else {
      console.log('Processing direct checkout...'); // Debug log
      this.processDirectCheckout();
    }
  }

  processDirectCheckout() {
    console.log('=== DIRECT CHECKOUT METHOD CALLED ==='); // Debug log
    // Prepare checkout request (allow guest checkout)
    const checkoutRequest: CheckoutRequest = {
      userId: this.currentUser?.id || null, // Allow null for guest checkout
      items: this.checkoutService.convertCartItemsToCheckoutItems(this.cartItems),
      totalAmount: this.finalTotal,
      note: this.note,
      shipFullName: this.shippingInfo.fullName,
      shipPhone: this.shippingInfo.phone,
      shipEmail: this.shippingInfo.email,
      shipStreet: this.shippingInfo.street,
      shipWard: this.shippingInfo.ward,
      shipDistrict: this.shippingInfo.district,
      shipProvince: this.shippingInfo.province
    };

    console.log('Direct checkout request:', checkoutRequest); // Debug log

    // Call direct checkout API
    this.checkoutService.processCheckout(checkoutRequest).subscribe({
      next: (response) => {
        console.log('Checkout response:', response); // Debug log
        if (response.success) {
          // Clear cart after successful checkout
          this.cartService.clearCart();
          
          // Show success message and redirect
          alert('Đặt hàng thành công! Mã đơn hàng: ' + (response.orderCode || response.paymentCode) + '\nĐơn hàng đang chờ xử lý.');
          
          // Redirect to home or orders page
          this.router.navigate(['/']);
        } else {
          alert('Có lỗi xảy ra khi đặt hàng: ' + (response.message || 'Không thể xử lý đơn hàng'));
          this.isProcessing = false;
        }
      },
      error: (error) => {
        console.error('Checkout error:', error);
        let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán.';
        
        if (error.status === 0) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.';
        } else if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          this.router.navigate(['/login']);
        } else if (error.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        alert(errorMessage);
        this.isProcessing = false;
      }
    });
  }

  processPayOSCheckout() {
    console.log('=== PAYOS CHECKOUT METHOD CALLED ==='); // Debug log
    // Prepare checkout request for PayOS
    const checkoutRequest: CheckoutRequest = {
      userId: this.currentUser?.id || null,
      items: this.checkoutService.convertCartItemsToCheckoutItems(this.cartItems),
      totalAmount: this.finalTotal,
      note: this.note,
      shipFullName: this.shippingInfo.fullName,
      shipPhone: this.shippingInfo.phone,
      shipEmail: this.shippingInfo.email,
      shipStreet: this.shippingInfo.street,
      shipWard: this.shippingInfo.ward,
      shipDistrict: this.shippingInfo.district,
      shipProvince: this.shippingInfo.province
    };

    console.log('PayOS checkout request:', checkoutRequest);

    // Call PayOS checkout API
    this.checkoutService.processPayOSCheckout(checkoutRequest).subscribe({
      next: (response) => {
        console.log('PayOS checkout response:', response);
        if (response.success && response.paymentUrl) {
          // Redirect to PayOS payment page
          this.payOSService.redirectToPayment(response.paymentUrl);
        } else {
          alert('Có lỗi xảy ra khi tạo link thanh toán: ' + (response.message || 'Không thể tạo link thanh toán'));
          this.isProcessing = false;
        }
      },
      error: (error) => {
        console.error('PayOS checkout error:', error);
        let errorMessage = 'Có lỗi xảy ra khi tạo link thanh toán.';
        
        if (error.status === 0) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.';
        } else if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          this.router.navigate(['/login']);
        } else if (error.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        alert(errorMessage);
        this.isProcessing = false;
      }
    });
  }

  validateForm(): boolean {
    console.log('Validating form with data:', this.shippingInfo);
    
    if (!this.shippingInfo.fullName.trim()) {
      alert('Vui lòng nhập họ tên');
      console.log('Validation failed: fullName');
      return false;
    }
    if (!this.shippingInfo.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      console.log('Validation failed: phone');
      return false;
    }
    if (!this.shippingInfo.email.trim()) {
      alert('Vui lòng nhập email');
      console.log('Validation failed: email');
      return false;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.shippingInfo.email)) {
      alert('Vui lòng nhập địa chỉ email hợp lệ');
      console.log('Validation failed: invalid email format');
      return false;
    }
    if (!this.shippingInfo.street.trim()) {
      alert('Vui lòng nhập địa chỉ');
      console.log('Validation failed: street');
      return false;
    }
    if (!this.shippingInfo.ward.trim()) {
      alert('Vui lòng nhập phường/xã');
      console.log('Validation failed: ward');
      return false;
    }
    if (!this.shippingInfo.district.trim()) {
      alert('Vui lòng nhập quận/huyện');
      console.log('Validation failed: district');
      return false;
    }
    if (!this.shippingInfo.province.trim()) {
      alert('Vui lòng nhập tỉnh/thành phố');
      console.log('Validation failed: province');
      return false;
    }
    
    console.log('Form validation passed');
    return true;
  }


  // Create order in backend
  createOrder(paymentRequest: any) {
    const orderData = {
      orderCode: paymentRequest.orderId,
      userId: this.currentUser?.id || null,
      items: this.checkoutService.convertCartItemsToCheckoutItems(this.cartItems),
      totalAmount: this.finalTotal,
      note: this.note,
      // Thông tin giao hàng - rất quan trọng cho admin
      shipFullName: this.shippingInfo.fullName,
      shipPhone: this.shippingInfo.phone,
      shipEmail: this.shippingInfo.email,
      shipStreet: this.shippingInfo.street,
      shipWard: this.shippingInfo.ward,
      shipDistrict: this.shippingInfo.district,
      shipProvince: this.shippingInfo.province,
      paymentMethod: paymentRequest.paymentMethod,
      paymentStatus: paymentRequest.status,
      // Thêm thông tin bổ sung
      orderDate: new Date().toISOString(),
      status: 'PENDING' // Trạng thái đơn hàng
    };

    console.log('Order data being sent to backend:', orderData);
    console.log('Backend API URL:', 'http://localhost:8081/api/checkout');

    // Call backend API to create order
    this.checkoutService.processCheckout(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        console.log('Response data:', JSON.stringify(response, null, 2));
        
        // Clear cart
        this.cartService.clearCart();
        
        // Redirect to success page
        this.router.navigate(['/payment-result'], {
          queryParams: {
            success: 'true',
            orderId: paymentRequest.orderId,
            amount: paymentRequest.amount,
            paymentMethod: paymentRequest.paymentMethod
          }
        });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error,
          url: error.url
        });
        alert('Có lỗi khi tạo đơn hàng. Vui lòng thử lại. Chi tiết: ' + (error.message || error));
        this.isProcessing = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}