import { CurrentWeatherDataType } from '@/lib/interfaces'
import { Typography } from '@mui/material'
import styles from './weatherReport.module.css'

interface WeatherReportProps {
    currentWeather: CurrentWeatherDataType
}
export const WeatherReport: React.FC<WeatherReportProps> = ({
    currentWeather,
}: WeatherReportProps) => {
    const [shortTime, date] = currentWeather.time.split('T')
    const dayNightColorStyle = 'dayNightColorGradient' + shortTime.slice(0, 1)
    return (
        <div className={styles.weatherReportWrapper}>
            <Typography variant="h1" component="h1" gutterBottom>
                Temperature: {currentWeather.temperature_2m}
            </Typography>
        </div>
    )
}
