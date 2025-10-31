export interface Order {
  id: number;
  orderCode: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  createdDate: string;
  updatedDate: string;
  orderDate?: string; // Optional field for order date
  note?: string; // Optional field for order note
  orderItems: OrderItem[];
  shipFullName: string;
  shipPhone: string;
  shipStreet: string;
  shipWard: string;
  shipDistrict: string;
  shipProvince: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  productImage: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderStatistics {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

