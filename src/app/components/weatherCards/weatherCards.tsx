import { CoordinatesType } from '@/app/geolocation/page'
import { WeatherCard } from './weatherCard'
import styles from './weatherCards.module.css'

export default function WeatherCards({
    getWeather,
}: {
    getWeather: (coords: CoordinatesType) => Promise<string>
}) {
    //need a generator to create the formatted data for the cards
    const cardData = [
        {
            day: 'Monday',
            temp: 80,
        },
        {
            day: 'Tuesday',
            temp: 90,
        },
        {
            day: 'Wednesday',
            temp: 100,
        },
        {
            day: 'Thursday',
            temp: 110,
        },
        {
            day: 'Friday',
            temp: 105,
        },
        {
            day: 'Saturday',
            temp: 83,
        },
        {
            day: 'Sunday',
            temp: 53,
        },
    ]
    const weatherCards = cardData.map((weather) => (
        <div key={weather.day} className={styles.cardWrapper}>
            <WeatherCard props={weather} />
        </div>
    ))
    return (
        <div className={styles.cardsListWrapper}>
            <ul className={styles.cardsList}>{weatherCards}</ul>
        </div>
    )
}
