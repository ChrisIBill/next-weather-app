'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.scss'
import RainBackground from './rain'
import { useContext } from 'react'
import { ThemeContext, useTheme } from '@/lib/context'

export default function Home() {
    const theme = useTheme()
    console.log('Theme: ', theme)
    return (
        <main className={styles.main}>
            <RainBackground />
        </main>
    )
}
