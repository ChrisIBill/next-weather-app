import {
    CurrentWeatherDataType,
    DailyWeatherForecastType,
    DetailedWeatherDataType,
} from '@/lib/interfaces'
import { Typography } from '@mui/material'
import styles from './dailyWeatherReport.module.css'

interface WeatherReportProps {
    forecast?: DetailedWeatherDataType
    selectedDay?: number
    selectedHour?: number
}
export const DailyWeatherReport: React.FC<WeatherReportProps> = ({
    forecast,
    selectedHour,
}: WeatherReportProps) => {
    const [date, hours] = forecast?.time ? forecast.time.split('T') : ['', '']
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
