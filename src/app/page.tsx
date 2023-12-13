'use client'
import styles from './page.module.css'
import './globals.scss'
import { Background } from './components/background/background'
import { PlaygroundSliders } from './components/playgroundSliders'

export default function Home() {
    return (
        <div className={styles.landingPage} style={{}}>
            <PlaygroundSliders />
            <Background />
        </div>
    )
}
