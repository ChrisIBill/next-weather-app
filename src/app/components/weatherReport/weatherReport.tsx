import {
    CurrentWeatherDataType,
    DailyWeatherForecastType,
    DetailedWeatherDataType,
} from '@/lib/interfaces'
import { Typography } from '@mui/material'
import styles from './weatherReport.module.css'

interface WeatherReportProps {
    weatherForecast?: DetailedWeatherDataType
    selectedDay?: number
    selectedHour?: number
}
export const WeatherReport: React.FC<WeatherReportProps> = ({
    weatherForecast,
    selectedDay,
}: WeatherReportProps) => {
    const [date, hours] = weatherForecast?.time
        ? weatherForecast.time.split('T')
        : ['', '']
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
