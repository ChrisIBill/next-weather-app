import { Card } from '@mui/material'
import styles from './weatherCard.module.css'

export default function WeatherCard(cardProps: any) {
    return (
        <Card className={styles.card} variant="elevation">
            <h1>Weather Card</h1>
            <h2>{cardProps.temp}</h2>
        </Card>
    )
}
