import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import styles from './weatherCard.module.css'
import { DailyWeatherForecastType } from '@/lib/interfaces'
import { getDateObject } from '@/lib/time'
import { WeatherCodesMap } from '@/lib/weathercodes'
import ErrorBoundary from '@/lib/errorBoundary'
import RainBackground from '@/app/rain'
import paletteHandler from '@/lib/paletteHandler'
import { useTheme } from '@/lib/context'

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
    const theme = useTheme()
    const palette = paletteHandler(theme.theme)
    return (
        <Card
            className={styles.weatherCard}
            variant="elevation"
            sx={{
                //backgroundImage:
                //    'linear-gradient(to bottom, #1E101A, #2a1726, #3d2243, #4a3266, #4a458e, #4954a5, #4263bc, #3173d4, #447fdd, #558be7, #6597f0, #74a3f9, #74a3f9)',
                backgroundColor: 'transparent',
                border: `1px solid ${palette.textPrimary}`,
                color: `${palette.textPrimary}`,
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
                        <ErrorBoundary
                            fallback={
                                <div className={styles.headerWrapper}>
                                    <Typography variant="h5">
                                        Error with date element
                                    </Typography>
                                </div>
                            }
                        >
                            <WeatherCardHeader date={weather.time!} />
                        </ErrorBoundary>
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

export const CardContentKeys = [
    'weathercode',
    'temperature_2m_min',
    'temperature_2m_max',
]

export interface CardContentProps {
    weather: DailyWeatherForecastType
}
const WeatherCardContent: React.FC<CardContentProps> = ({
    weather,
}: CardContentProps) => {
    for (const key of CardContentKeys) {
        if (weather[key] === undefined) {
            weather[key] = 'N/A'
        }
    }
    //const precipType = weather.rain_sum ?
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
            <Typography variant="caption">Temp</Typography>
            <Typography variant="body1">
                {weather.temperature_2m_min}° / {weather.temperature_2m_max}°
            </Typography>
            <Typography variant="caption">Feels Like</Typography>
            <Typography variant="body1">
                {weather.apparent_temperature_min}° /{' '}
                {weather.apparent_temperature_max}°
            </Typography>
            <Typography variant="body1">
                {weather.precipitation_probability_max}% chance of{' '}
            </Typography>
            <Typography variant="body1"></Typography>
        </div>
    )
}
const CardBackground: React.FC = (props) => {
    return <RainBackground />
}
