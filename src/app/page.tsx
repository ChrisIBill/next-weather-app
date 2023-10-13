import Image from 'next/image'
import styles from './page.module.css'
import makeItRain from './make-it-rain.tsx'

export default function Home() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>Drizzle</h1>
                <h3>(Yet Another Weather App)</h3>
            </header>
            <Background />
        </main>
    )
}
