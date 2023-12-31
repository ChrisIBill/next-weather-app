import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import _ from 'lodash'
import logger from './pinoLogger'
import { BREAKPOINTS } from './paletteHandler'

function getWindowDimensions() {
    if (typeof window !== 'undefined') {
        const { innerWidth: width, innerHeight: height } = window
        return {
            width,
            height,
        }
    } else {
        return {
            width: undefined,
            height: undefined,
        }
    }
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    )

    useEffect(() => {
        const handleResize = _.debounce(() => {
            setWindowDimensions(getWindowDimensions())
        }, 300)

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}

const ScrollPositionHookLogger = logger.child({ component: 'ScrollPosition' })

export function useScrollPosition() {
    ScrollPositionHookLogger.debug('Rendering ScrollPositionHook')
    const [scrollPosition, setScrollPosition] = useState(0)
    useEffect(() => {
        const handleScroll = () => setScrollPosition(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return [scrollPosition, setScrollPosition]
}

export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState('xs')
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    )
    useEffect(() => {
        const handleResize = _.debounce(() => {
            setWindowDimensions(getWindowDimensions())
        }, 300)

        window.addEventListener('resize', handleResize)
        if (typeof windowDimensions.width !== 'undefined')
            switch (true) {
                case windowDimensions.width < BREAKPOINTS.xs:
                    setBreakpoint('xs')
                    break
                case windowDimensions.width < BREAKPOINTS.sm:
                    setBreakpoint('sm')
                    break
                case windowDimensions.width < BREAKPOINTS.md:
                    setBreakpoint('md')
                    break
                case windowDimensions.width < BREAKPOINTS.lg:
                    setBreakpoint('lg')
                    break
                default:
                    setBreakpoint('xs')
            }
        return () => window.removeEventListener('resize', handleResize)
    }, [windowDimensions.width])
    return {
        breakpoint,
        windowDimensions,
    }
}
