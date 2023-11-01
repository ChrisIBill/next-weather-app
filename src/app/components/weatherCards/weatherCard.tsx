import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import styles from './weatherCard.module.css'
import { DailyWeatherForecastType } from '@/lib/interfaces'
import { getDateObject } from '@/lib/time'

export interface WeatherCardProps {
    weather: DailyWeatherForecastType
    handleCardSelect: (day: number) => void
    index: number
    selectedDay?: number
}
export const WeatherCard: React.FC<WeatherCardProps> = (
    props: WeatherCardProps
) => {
    const weather = props.weather
    if (!weather) throw new Error('No weather data')
    const date = getDateObject(weather.time)
    return (
        <Card
            className={styles.weatherCard}
            variant="elevation"
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
        >
            <CardActionArea
                className={styles.actionArea}
                onClick={(event) => props.handleCardSelect(props.index)}
                disabled={props.index == props.selectedDay}
            >
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <WeatherCardHeader date={weather.time} />
                        <br />
                        <WeatherCardContent weather={weather} />
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export interface CardHeaderProps {
    date: string
}

export const WeatherCardHeader: React.FC<CardHeaderProps> = (
    props: CardHeaderProps
) => {
    const date = getDateObject(props.date)
    return (
        <div className={styles.headerWrapper}>
            <Typography variant="h5">{date.format('dddd')}</Typography>
            <Typography variant="h6">{date.format('MMM D')}</Typography>
        </div>
    )
}

export interface CardContentProps {
    weather: DailyWeatherForecastType
}

const WeatherCardContent: React.FC<CardContentProps> = (
    props: CardContentProps
) => {
    return (
        <div className={styles.contentWrapper}>
            <Typography variant="body1">
                {props.weather.temperature_2m_min}
            </Typography>
        </div>
    )
}
