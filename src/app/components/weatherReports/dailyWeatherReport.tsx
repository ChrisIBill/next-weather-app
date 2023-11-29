import {
    CurrentWeatherDataType,
    DailyWeatherForecastType,
    DetailedWeatherDataType,
} from '@/lib/interfaces'
import { Typography, useTheme } from '@mui/material'
import styles from './dailyWeatherReport.module.css'
import { useBackgroundColors } from '../background/dayNightColorLayer'
import { TimeObjectType } from '@/lib/time'

interface WeatherReportProps {
    forecast?: DetailedWeatherDataType
    metadata?: any
    selectedHour?: number
    timeObj: TimeObjectType
}
export const CurrentWeatherReport: React.FC<WeatherReportProps> = ({
    forecast,
    selectedHour,
    timeObj,
}: WeatherReportProps) => {
    const [date, hours] = forecast?.time ? forecast.time.split('T') : ['', '']

    const theme = useTheme()
    const palette = theme.palette
    const backgroundColor = useBackgroundColors()[timeObj.timeOfDay!]

    return (
        <div
            className={styles.wrapper}
            style={{
                color: palette.getContrastText(backgroundColor),
            }}
        >
            <Typography variant="body1" gutterBottom>
                Temperature: {forecast?.temperature_2m}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Wind speed: {forecast?.windspeed_10m}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Cloud Cover: {forecast?.cloudcover}
            </Typography>
        </div>
    )
}
