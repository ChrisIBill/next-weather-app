import { CoordinatesType } from '@/app/geolocation/page'
import { WeatherCard, WeatherCardProps } from './weatherCard'
import styles from './weatherCards.module.css'
import { DailyWeatherForecastType } from '@/lib/interfaces'

export interface WeatherCardsProps {
    weatherForecast: DailyWeatherForecastType[]
}
export const WeatherCards: React.FC<WeatherCardsProps> = (props: WeatherCardsProps) => {
    //need a generator to create the formatted data for the cards
    const weatherCards = props.weatherForecast.map((weather) =>
        <div key={weather.date} className={styles.cardWrapper}>
            <WeatherCard weather={weather} />
        </div>
    )
    return (
        <div className={styles.cardsListWrapper}>
            <ul className={styles.cardsList}>{weatherCards}</ul>
        </div>
    )
}
