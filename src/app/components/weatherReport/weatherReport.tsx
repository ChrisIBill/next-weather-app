import {
    CurrentWeatherDataType,
    DailyWeatherForecastType,
} from '@/lib/interfaces'
import { Typography } from '@mui/material'
import styles from './weatherReport.module.css'

interface WeatherReportProps {
    currentWeather?: CurrentWeatherDataType
    weatherForecast: DailyWeatherForecastType[]
    selectedDay?: number
    selectedHour?: number
}
export const WeatherReport: React.FC<WeatherReportProps> = ({
    currentWeather,
    weatherForecast,
    selectedDay,
}: WeatherReportProps) => {
    const [shortTime, date] = currentWeather.time.split('T')
    return (
        <div className={styles.weatherReportWrapper}>
            {/*<WeatherReportHeader />
            <CurrentWeatherDisplay currentWeather={currentWeather} />
            <HourlyWeatherDisplay weatherForecast={weatherForecast} />
            <Typography variant="h1" component="h1" gutterBottom>
                Temperature: {currentWeather.temperature_2m}
            </Typography>*/}
        </div>
    )
}
