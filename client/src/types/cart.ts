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
  coupon: { _id: string; code: string; percent: number } | null;
  removedItems?: { reason: string; courseId?: string }[];
  pricing: CartPricing;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  data: ICart;
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    order: { _id: string; paymentMethod: string };
    paymentUrl: string | null;
  };
}