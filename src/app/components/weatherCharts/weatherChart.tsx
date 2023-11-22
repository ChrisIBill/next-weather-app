import React, { useEffect } from 'react'
import {
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import {
    DailyWeatherForecastType,
    DetailedWeatherDataType,
    HourlyWeatherDataType,
} from '@/lib/interfaces'
import styles from './weatherChart.module.scss'
import { Box, Paper, Tab, Tabs } from '@mui/material'

export type ChartDataKeys =
    | 'Temperature'
    | 'Precipitation'
    | 'Humidity'
    | 'Wind'

function getChartDataFromForecast(
    forecast: DetailedWeatherDataType[],
    key: ChartDataKeys
) {
    const forecastKey = () => {
        switch (key) {
            case 'Temperature':
                return 'temperature_2m'
            case 'Precipitation':
                return 'precipitation'
            case 'Humidity':
                return 'humidity'
            case 'Wind':
                return 'wind'
        }
    }
    //return forecast.map(())
}
export interface WeatherChartProps {
    forecast: DailyWeatherForecastType[]
    metadata: any
    handleChartSelect: (day: number) => void
    selectedDay?: number
    selectedHour?: number
}
export const WeatherChart: React.FC<WeatherChartProps> = (props) => {
    const selectedForecast = props.selectedDay
        ? props.forecast[props.selectedDay]
        : undefined
    const [selectedVar, setSelectedVar] =
        React.useState<ChartDataKeys>('Temperature')
    if (props.forecast[0] === undefined) return <div>Loading...</div>
    return (
        <Box
            className={styles.weatherChart}
            sx={{
                width: '850px',
                height: '450px',
            }}
        >
            <Tabs
                value={selectedVar}
                onChange={(e, val) => setSelectedVar(val)}
                sx={{
                    color: 'black',
                }}
            >
                <Tab label="Temperature" value="Temperature" />
                <Tab label="Precipitation" value="Precipitation" />
                <Tab label="Humidity" value="Humidity" />
                <Tab label="Wind" value="Wind" />
            </Tabs>
            <DailyWeatherChart
                forecast={props.forecast}
                chartKey={selectedVar}
                metadata={props.metadata}
                handleChartSelect={props.handleChartSelect}
                selectedDay={props.selectedDay}
            />
        </Box>
    )
    //false ? (
    //    <HourlyWeatherChart
    //        forecast={props.forecast[props.selectedDay].hourly_weather}
    //        key={selectedVar}
    //        metadata={props.metadata}
    //        handleChartSelect={props.handleChartSelect}
    //        selectedHour={props.selectedHour}
    //    />
    //) :
}

export interface HourlyWeatherChartProps {
    forecast: HourlyWeatherDataType[]
    chartKey: string
    metadata: any
    handleChartSelect: (day: number) => void
    selectedHour?: number
}
export const HourlyWeatherChart: React.FC<HourlyWeatherChartProps> = (
    props
) => {
    return <AreaChart width={800} height={400} data={props.forecast} />
}
export interface DailyWeatherChartProps {
    forecast: DailyWeatherForecastType[]
    chartKey: ChartDataKeys
    metadata: any
    handleChartSelect: (day: number) => void
    selectedDay?: number
}
export const DailyWeatherChart: React.FC<DailyWeatherChartProps> = (
    props: DailyWeatherChartProps
) => {
    const data = props.forecast.map((day, index) => {
        console.log('chart map day: ', day, index)
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    day: day.time,
                    values: [day.temperature_2m_max, day.temperature_2m_min],
                }
            case 'Precipitation':
                return {
                    day: day.time,
                    values: [
                        day.precipitation_sum,
                        day.precipitation_probability_max,
                    ],
                }
            case 'Humidity':
                return {
                    day: day.time,
                    values: [day.humidity_max, day.humidity_min],
                }
            case 'Wind':
                return {
                    day: day.time,
                    values: [day.windspeed_10m_max, day.windgusts_10m_max],
                }
            default:
                return {
                    day: 'Error',
                    values: [0, 0],
                }
        }
    })
    return (
        <BarChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="values" fill="#ffffff" />
        </BarChart>
    )
}
