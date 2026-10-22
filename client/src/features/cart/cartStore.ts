import type { Course } from "../../types/models"

export type CartItem = Pick<Course, "_id" | "name" | "shortName" | "cover" | "price" | "discount">

const STORAGE_KEY = "cart"
const listeners = new Set<() => void>()

let raw: string | null = null
let items: CartItem[] = []

const read = (): CartItem[] => {
    let next: string | null = null
    try { next = localStorage.getItem(STORAGE_KEY) } catch { /* storage unavailable */ }
    if (next !== raw) {
        raw = next
        try { items = next ? JSON.parse(next) as CartItem[] : [] } catch { items = [] }
    }
    return items
}

const write = (next: CartItem[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
    listeners.forEach(listener => listener())
}

export const cartStore = {
    subscribe(listener: () => void) {
        listeners.add(listener)
        const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) listener() }
        window.addEventListener("storage", onStorage)
        return () => {
            listeners.delete(listener)
            window.removeEventListener("storage", onStorage)
        }
    },
    getSnapshot: read,
    add(item: CartItem) {
        const current = read()
        if (current.some(i => i._id === item._id)) return
        write([...current, item])
    },
    remove(id: string) {
        write(read().filter(i => i._id !== id))
    },
    clear() {
        write([])
    },
}

export const finalPrice = (item: Pick<CartItem, "price" | "discount">) =>
    item.discount ? item.price - (item.price * item.discount) / 100 : item.price

export const money = (value: number) => `${Math.round(value).toLocaleString()} $`
