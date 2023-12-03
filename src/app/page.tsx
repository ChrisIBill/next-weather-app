'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.scss'
import { RainBackground } from './rain'
import { useContext } from 'react'
import { Clouds2 } from './components/background/clouds2'

export default function Home() {
    return <main className={styles.main}></main>
}
