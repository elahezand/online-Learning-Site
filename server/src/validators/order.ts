import { z } from "zod";
import { choice, idParams, objectId, optional, paginationQuery, text } from "./common";

const ORDER_STATUS = ["created", "processing", "completed", "cancelled"] as const;
const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded"] as const;

export const checkoutSchema = z.object({
  useWallet: z.boolean().optional().default(false),
  idempotencyKey: optional(text("Idempotency key", { max: 100 })),
});

export const myOrdersQuery = paginationQuery.extend({
  status: optional(choice("Status", ORDER_STATUS)),
  q: optional(text("Search", { max: 24 })),
});

export const orderListQuery = myOrdersQuery.extend({
  paymentStatus: optional(choice("Payment status", PAYMENT_STATUS)),
  user: optional(objectId("User")),
});

export const orderParams = idParams("Order id");

export const orderItemParams = z.object({
  id: objectId("Order id"),
  itemId: objectId("Item id"),
});

export const updateOrderSchema = z
  .object({
    status: optional(z.literal("cancelled", { error: "Status can only be changed to cancelled" })),
    paymentStatus: optional(z.literal("failed", { error: "Payment status can only be changed to failed" })),
  })
  .refine((data) => data.status || data.paymentStatus, { message: "Nothing to change" });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type MyOrdersQuery = z.infer<typeof myOrdersQuery>;
export type OrderListQuery = z.infer<typeof orderListQuery>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;