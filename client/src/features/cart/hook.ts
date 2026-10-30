import { usePost, useDelete, useGet } from "../../hooks/useReactQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CheckoutResponse, CartResponse } from "../../types/cart";
import { clearCheckoutKey } from "../../utils/idempotencyKey";

const CART_KEY = ["cart"];

export interface CheckoutBody {
    paymentMethod: "zarinpal"
    useWallet: boolean
    idempotencyKey: string
}

export const useGetMyCart = (enabled = true) =>
    useGet<CartResponse>("/cart/me", undefined, {
        queryKey: CART_KEY,
        enabled,
        staleTime: 0,
    });

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return usePost<CartResponse, { courseId: string }>("/cart/me/items", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_KEY });
            toast.success("Added to cart");
        },
        errorFallback: "Couldn't add this course to the cart",
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useDelete<CartResponse, { courseId: string }>(({ courseId }) => `/cart/me/items/${courseId}`, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
        errorFallback: "Failed to remove course",
    });
};

export const useApplyCoupon = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return usePost<CartResponse, { code: string }>("/cart/me/coupon", {
        onSuccess: () => {
            toast.success("Discount code applied");
            queryClient.invalidateQueries({ queryKey: CART_KEY });
            onSuccessCallback?.();
        },
        errorFallback: "This code is not valid",
    });
};

export const useRemoveCoupon = () => {
    const queryClient = useQueryClient();

    return useDelete<CartResponse, void>("/cart/me/coupon", {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
        errorFallback: "Failed to remove the code",
    });
};

export const useCheckout = (
    cartId?: string,
    onPlaced?: (orderId?: string) => void
) => {
    const queryClient = useQueryClient();

    return usePost<CheckoutResponse, CheckoutBody>("/orders/checkout", {
        onSuccess: (data) => {
            if (cartId) clearCheckoutKey(cartId);
            queryClient.invalidateQueries({ queryKey: CART_KEY });
            queryClient.invalidateQueries({ queryKey: ["me", "courses"] });

            if (data?.data?.paymentUrl) {
                window.location.href = data.data.paymentUrl;
                return;
            }
            toast.success("Order placed successfully");
            onPlaced?.(data?.data?.order?._id);
        },
        errorFallback: "Checkout failed",
    });
};