'use client'
import styles from './page.module.css'
import './globals.scss'
import { Background } from './components/background/background'
import { PlaygroundSliders } from './components/playgroundSliders'
import { useEffect, useState } from 'react'
import DayTimeClass from '@/lib/obj/time'
import { useTheme } from '@mui/material'

export default function Home() {
    const [mode, setMode] = useState<'light' | 'dark'>('light')

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
        >
            <PlaygroundSliders />
            <Background />
        </div>
    )
}
