import Image from 'next/image'
import styles from './page.module.css'
import RainBackground from './rain'
import WeatherCards from './components/weatherCards/weatherCards'

export default function Home() {
    async function getWeather() {
        'use server'
    }
    return (
        <main className={styles.main}>
            <WeatherCards getWeather={getWeather} />
            <RainBackground />
        </main>
    )
}
