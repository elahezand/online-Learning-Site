import { useEffect, useRef, useState } from 'react'


export default function useFramer() {
    const [isShowView, setIsShowView] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsShowView(true)
                observer.unobserve(entry.target)
            }

        }, { threshold: 0.2,
            rootMargin:"0px 0px -50px 0px",
            root:null
         })

        if (ref.current) {
            observer.observe(ref.current)
        }
    }, [])
    return [isShowView, ref]
}
