import { useEffect, useRef, useState } from "react"

/*
 * true once the element has entered the viewport (used for fade-in).
 * threshold 0: a section taller than the screen still counts as visible
 * as soon as its first pixel shows up.
 */
export default function useInView() {
    const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined")
    const ref = useRef(null)

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
