export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  images?: string[];
  helpful: number;
  verified: boolean;
}