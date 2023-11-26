import React, { useEffect } from 'react'
import {
    DailyWeatherForecastType,
    DetailedWeatherDataType,
    HourlyWeatherDataType,
} from '@/lib/interfaces'
import styles from './weatherChart.module.scss'
import { Box, Paper } from '@mui/material'
import { useTheme } from '@/lib/context'
import { WeatherChartControls, WeatherChartHeader } from './chartComponents'
import { HourlyWeatherChart } from './hourlyWeatherCharts'
import { DailyWeatherChart } from './dailyWeatherChart'
import paletteHandler from '@/lib/paletteHandler'

export const ChartTimespan = ['Day', 'Week'] as const
export const ChartKeys = [
    'Temperature',
    'Precipitation',
    'Humidity',
    'Wind',
] as const

export type ChartTimespanType = (typeof ChartTimespan)[number]
export type ChartKeysType = (typeof ChartKeys)[number]

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
    const theme = useTheme().theme
    const palette = paletteHandler(theme)
    const [chartType, setChartType] = React.useState<ChartTimespanType>('Day')
    const selectedForecast = props.selectedDay
        ? props.forecast[props.selectedDay]
        : props.forecast[0]
    const [selectedVar, setSelectedVar] =
        React.useState<ChartDataKeys>('Temperature')

    const handleChartTypeChange = (e: any, val: any) => {
        console.log(val)
        setChartType(val)
    }
    const handleChartKeyChange = (e: any, val: any) => {
        console.log(val)
        setSelectedVar(val)
    }
    if (props.forecast[0] === undefined) return <div>Loading...</div>
    return (
        <Box
            className={styles.weatherChart}
            sx={{
                width: '850px',
                height: '450px',
            }}
        >
            <Paper
                className={styles.chartContainer}
                sx={{
                    backgroundColor: 'transparent',
                }}
            >
                <WeatherChartHeader
                    selectedKey={selectedVar}
                    selectedTimespan={chartType}
                    chartKeys={[
                        'Temperature',
                        'Precipitation',
                        'Humidity',
                        'Wind',
                    ]}
                    handleKeySelect={handleChartKeyChange}
                    handleTimespanSelect={handleChartTypeChange}
                />
                <div className={styles.chartWrapper}>
                    {chartType === 'Week' ? (
                        <DailyWeatherChart
                            forecast={props.forecast}
                            chartKey={selectedVar}
                            metadata={props.metadata}
                            handleChartSelect={props.handleChartSelect}
                            selectedDay={props.selectedDay}
                        />
                    ) : (
                        <HourlyWeatherChart
                            forecast={selectedForecast?.hourly_weather!}
                            chartKey={selectedVar}
                            metadata={props.metadata}
                            handleChartSelect={props.handleChartSelect}
                            selectedHour={props.selectedHour}
                        />
                    )}
                </div>
            </Paper>
        </Box>
    )
}
