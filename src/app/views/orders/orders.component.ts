import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  router = inject(Router);

  orders: Order[] = [];
  loading = false;
  currentUser: any = null;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/orders' } });
      return;
    }

    this.loadUserOrders();
  }

  loadUserOrders() {
    this.loading = true;
    this.orderService.getUserOrders(this.currentUser.id).subscribe({
      next: (orders) => {
        console.log('Orders data from backend:', orders);
        if (orders.length > 0) {
          console.log('First order dates:', {
            createdDate: orders[0].createdDate,
            updatedDate: orders[0].updatedDate,
            createdDateType: typeof orders[0].createdDate
          });
        }
        
        this.orders = orders.sort((a, b) => {
          const dateA = new Date(a.createdDate);
          const dateB = new Date(b.createdDate);
          return dateB.getTime() - dateA.getTime();
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user orders:', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return this.orderService.getStatusColor(status);
  }

  getStatusText(status: string): string {
    return this.orderService.getStatusText(status);
  }

  formatCurrency(amount: number): string {
    return this.orderService.formatPrice(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return 'Không xác định';
    }
    
    // Handle different date formats
    let date: Date;
    
    try {
      // Try parsing ISO format first
      if (dateString.includes('T')) {
        date = new Date(dateString);
      } else {
        // Try parsing other common formats
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 24) {
        // Hiển thị thời gian tương đối cho ngày hôm nay
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
          if (diffInMinutes < 1) {
            return 'Vừa xong';
          }
          return `${diffInMinutes} phút trước`;
        }
        return `${diffInHours} giờ trước`;
      } else if (diffInHours < 48) {
        return 'Hôm qua lúc ' + date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        // Hiển thị ngày tháng đầy đủ
        return date.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return 'Ngày không hợp lệ';
    }
  }

  viewOrderDetails(order: Order) {
    // Navigate to order details page (to be implemented)
    console.log('View order details:', order);
  }

  reorder(order: Order) {
    // Add order items back to cart
    let addedCount = 0;
    
    order.orderItems.forEach(item => {
      // Add each item to cart
      for (let i = 0; i < item.quantity; i++) {
        this.cartService.addToCart({
          id: item.productId,
          name: item.productName,
          price: item.productPrice,
          image: item.productImage,
          category: 'Unknown', // Default category
          rating: 0 // Default rating
        });
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      this.router.navigate(['/cart']);
    }
  }

  cancelOrder(order: Order) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      // Call API to cancel order
      console.log('Cancel order:', order);
      alert('Chức năng hủy đơn hàng sẽ được cập nhật sớm');
    }
  }

  getPaymentForOrder(orderId: number): any {
    // Since payment info is now included in OrderResponse, return the order's payment info
    const order = this.orders.find(o => o.id === orderId);
    return order ? {
      status: order.paymentStatus,
      method: order.paymentMethod,
      amount: order.totalAmount
    } : null;
  }

  getPaymentStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'Thành công';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }
}