import { Card } from '@mui/material'
import styles from './weatherCard.module.css'
import { DailyWeatherForecastType } from '@/lib/interfaces'
import { getDayOfWeek } from '@/lib/time'

export interface WeatherCardProps {
    weather: DailyWeatherForecastType
}
export const WeatherCard: React.FC<WeatherCardProps> = (
    props: WeatherCardProps
) => {
    const weather = props.weather
    if (!weather) throw new Error('No weather data')
    const dayOfWeek = getDayOfWeek(weather?.date)
    return (
        <Card className={styles.card} variant="elevation">
            <h1>{dayOfWeek}</h1>
        </Card>
    )
}
