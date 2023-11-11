import { useState, useEffect } from 'react'

function getWindowDimensions() {
    if (typeof window === 'undefined')
        throw new Error(
            'Client side hook useWindowDimensions is not available on server side'
        )
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    )

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}
