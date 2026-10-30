export interface CartCourse {
  _id: string;
  name: string;
  shortName: string;
  cover?: string;
}

export interface CartItem {
  course: CartCourse;
  price: number;
  discount: number;
  finalPrice: number;
}

export interface CartPricing {
  subtotal: number;
  discount: number;
  total: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: CartItem[];
  coupon: { _id: string; code: string; percent: number; course: string } | null;
  removedItems?: { reason: string; courseId?: string }[];
  pricing: CartPricing;
  createdAt: string;
  updatedAt: string;
}

export type CartResponse = ICart;
export interface CheckoutResponse {
  order: { _id: string; paymentMethod: string; paymentStatus: string };
  paymentUrl: string | null;
}