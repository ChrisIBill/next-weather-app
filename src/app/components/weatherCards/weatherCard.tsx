import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import styles from './weatherCard.module.css'
import { DailyWeatherForecastType } from '@/lib/interfaces'
import { getDateObject } from '@/lib/time'
import { WeatherCodesMap } from '@/lib/weathercodes'

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
    date?: string
}

export const WeatherCardHeader: React.FC<CardHeaderProps> = (
    props: CardHeaderProps
) => {
    if (props.date === undefined) throw new Error('No date provided')
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

const WeatherCardContent: React.FC<CardContentProps> = ({
    weather,
}: CardContentProps) => {
    if (
        weather.weathercode === undefined ||
        weather.temperature_2m_min === undefined ||
        weather.temperature_2m_max === undefined
    )
        throw new Error('No weather data')
    return (
        <div className={styles.contentWrapper}>
            <Typography
                variant="body1"
                title={'WMO Code: ' + weather.weathercode}
            >
                {weather.weathercode !== undefined
                    ? WeatherCodesMap[weather.weathercode].short
                    : 'No weather code'}
            </Typography>
            <Typography variant="body1">
                {weather.temperature_2m_min}° / {weather.temperature_2m_max}°
            </Typography>
        </div>
    )
}
