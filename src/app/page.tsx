'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.scss'
import RainBackground from './rain'
import { useContext } from 'react'

export default function Home() {
    return (
        <main className={styles.main}>
            <RainBackground />
        </main>
    )
}
