import { Card } from '@mui/material'
import styles from './weatherCard.module.css'

export interface WeatherCardProps {
    datetime: string
    max_temp: number
    min_temp: number
    max_app_temp: number
    min_app_temp: number
}
export const WeatherCard: React.FC<WeatherCardProps> = (
    props: WeatherCardProps
) => {
    return (
        <Card className={styles.card} variant="elevation">
            <h1>Weather Card</h1>
        </Card>
    )
}
