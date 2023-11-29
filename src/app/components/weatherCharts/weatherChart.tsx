import React, { useEffect } from 'react'
import {
    DailyWeatherForecastType,
    DimensionsType,
    HourlyWeatherDataType,
} from '@/lib/interfaces'
import styles from './weatherChart.module.scss'
import { Box, Paper } from '@mui/material'
import { WeatherChartHeader } from './chartComponents'
import { HourlyWeatherChart } from './hourlyWeatherCharts'
import { DailyWeatherChart } from './dailyWeatherChart'
import { useWindowDimensions } from '@/lib/hooks'

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

const getChartWidth = (windowWidth?: number): number => {
    const chartWidth = windowWidth ? 0.8 * windowWidth : 600
    if (chartWidth < 600 && windowWidth) return windowWidth
    else return chartWidth
}

const getChartHeight = (windowHeight?: number) => {
    const chartHeight = windowHeight ? windowHeight : 300
    if (chartHeight < 300) return 301
    return chartHeight
}

const useChartDimensions = () => {
    const windowDimensions = useWindowDimensions()
    const [chartDimensions, setChartDimensions] = React.useState({
        height: getChartHeight(windowDimensions.height),
        width: getChartWidth(windowDimensions.width),
    })

    useEffect(() => {
        setChartDimensions({
            height: getChartHeight(windowDimensions.height),
            width: getChartWidth(windowDimensions.width),
        })
    }, [windowDimensions])

    return chartDimensions
}

export interface WeatherChartProps {
    forecast: DailyWeatherForecastType[]
    metadata: any
    handleChartSelect: (day: number) => void
    selectedDay?: number
    selectedHour?: number
    parentRef?: React.MutableRefObject<HTMLDivElement>
}
export const WeatherChart: React.FC<WeatherChartProps> = (
    props: WeatherChartProps
) => {
    const [chartType, setChartType] = React.useState<ChartTimespanType>('Day')
    const windowDimensions = useWindowDimensions()
    const chartDimensions: DimensionsType = {
        height: getChartHeight(props.parentRef?.current.offsetHeight),
        width: getChartWidth(props.parentRef?.current.offsetWidth),
    }
    console.log('chart dimensions: ', chartDimensions)

    //const chartDimensions = useChartDimensions(props)

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

    useEffect(() => {
        //TODO: better handling of chart resize
        //as of right now, the change in window is detected which causes a rerender of the chart,
        //including the chart dimensions element which handles the chart size
        console.log('Resizing')
    }, [windowDimensions])
    if (props.forecast[0] === undefined) return <div>Loading...</div>
    return (
        <Box
            className={styles.weatherChart}
            sx={{
                position: 'relative',
                width: chartDimensions.width,
                height: chartDimensions.height,
            }}
        >
            <Paper
                className={styles.chartContainer}
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(255,255,255,0)',
                    backgroundImage: 'none',
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
                            chartDimensions={chartDimensions}
                        />
                    ) : (
                        <HourlyWeatherChart
                            forecast={selectedForecast?.hourly_weather!}
                            chartKey={selectedVar}
                            metadata={props.metadata}
                            handleChartSelect={props.handleChartSelect}
                            selectedHour={props.selectedHour}
                            chartDimensions={chartDimensions}
                        />
                    )}
                </div>
            </Paper>
        </Box>
    )
}
