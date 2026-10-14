import { useEffect, useRef, useState } from 'react'

export default function LandingCounter({ value }) {
    const [counter, setCounter] = useState(0)
    const timer = useRef(null)
    useEffect(() => {
        timer.current = setInterval(() => {
            setCounter(prev => {
                if (prev === value) {
                    clearInterval(timer.current)
                }
                return prev = prev + 1
            })
        }, 0.5)

        return (() => clearInterval(timer.current))
    }, [value])

    return <span className="landing__stat-count" id="courses-count">{counter}</span>

}