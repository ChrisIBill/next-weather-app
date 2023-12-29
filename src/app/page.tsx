'use client'
import styles from './page.module.css'
import './globals.scss'
import { PlaygroundSliders } from './components/playgroundSliders'
import { useEffect, useState } from 'react'
import DayTimeClass from '@/lib/obj/time'
import { useTheme } from '@mui/material'
import dynamic from 'next/dynamic'
import { BackgroundProps } from './components/background/background'
import logger from '../lib/pinoLogger'

const landingPageLogger = logger.child({ module: 'landingPage' })

const Background = dynamic<BackgroundProps>(
    () =>
        import('./components/background/background').then(
            (mod) => mod.Background
        ),
    {
        ssr: false,
    }
)
export default function Home() {
    const [mode, setMode] = useState<'light' | 'dark'>('light')
    landingPageLogger.debug('rendering landing page')

    const theme = useTheme()
    useEffect(() => {
        if (theme.palette.mode === 'dark') setMode('dark')
        else setMode('light')
    }, [theme.palette.mode])
    return (
        <div
            className={styles.landingPage}
            data-theme={theme.palette.mode}
            style={{}}
            suppressHydrationWarning
        >
            <PlaygroundSliders />
            <Background />
        </div>
    )
}
