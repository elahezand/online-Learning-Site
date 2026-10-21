import { useEffect, useRef, useState } from "react"
import type React from "react"

export default function useInView<T extends Element = HTMLDivElement>(): [boolean, React.RefObject<T | null>] {
    const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined")
    const ref = useRef<T>(null)

    useEffect(() => {
        if (isVisible || !ref.current) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true)
                observer.disconnect()
            }
        }, { threshold: 0, rootMargin: "0px 0px -40px 0px" })

        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [isVisible])

    return [isVisible, ref]
}
