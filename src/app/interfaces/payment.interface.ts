export interface Payment {
  id: number;
  order: {
    id: number;
    orderCode: string;
    user: {
      username: string;
      email: string;
    } | null;
    shipFullName?: string;
    shipPhone?: string;
    shipStreet?: string;
    shipWard?: string;
    shipDistrict?: string;
    shipProvince?: string;
  };
  paymentCode: string;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  createdDate: string;
  updatedDate: string;
  paymentUrl?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface PaymentStatistics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalAmount: number;
  successfulAmount: number;
}

