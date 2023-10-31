import { CoordinatesType } from '@/app/geolocation/page'
import { WeatherCard, WeatherCardProps } from './weatherCard'
import styles from './weatherCards.module.css'
import { DailyWeatherForecastType } from '@/lib/interfaces'
import { Skeleton } from '@mui/material'

export interface WeatherCardsProps {
    weatherForecast: DailyWeatherForecastType[]
    handleCardSelect: (card: DailyWeatherForecastType) => void
}
export const WeatherCards: React.FC<WeatherCardsProps> = (
    props: WeatherCardsProps
) => {
    //need a generator to create the formatted data for the cards
    const weatherCards = props.weatherForecast?.map((weather, index) => {
        return (
            <div key={index} className={styles.cardWrapper}>
                {weather ? (
                    <WeatherCard weather={weather} />
                ) : (
                    <Skeleton variant="rectangular" width={210} height={118} />
                )}
            </div>
        )
    })
    return (
        <div className={styles.cardsListWrapper}>
            <ul className={styles.cardsList}>{weatherCards}</ul>
        </div>
    )
}
