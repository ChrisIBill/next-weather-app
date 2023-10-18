import Image from 'next/image'
import styles from './page.module.css'
import RainBackground from './rain'

export default function Home() {
    return (
        <main className={styles.main}>
            <RainBackground />
        </main>
    )
}
