import { useSyncExternalStore } from "react"
import { cartStore, finalPrice } from "./cartStore"

const EMPTY: never[] = []

export default function useCart() {
    const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, () => EMPTY)

    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    const total = items.reduce((sum, item) => sum + finalPrice(item), 0)

    return {
        items,
        count: items.length,
        subtotal,
        savings: subtotal - total,
        total,
        has: (id?: string) => Boolean(id) && items.some(item => item._id === id),
        add: cartStore.add,
        remove: cartStore.remove,
        clear: cartStore.clear,
    }
}
