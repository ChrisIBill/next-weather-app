import React, { useEffect } from 'react'
import {
    DailyWeatherForecastObjectType,
    DailyWeatherForecastType,
    DimensionsType,
} from '@/lib/interfaces'
import styles from './weatherChart.module.scss'
import { Box, Paper, useTheme } from '@mui/material'
import { WeatherChartHeader } from './chartComponents'
import { HourlyWeatherChart } from './hourlyWeatherCharts'
import { DailyWeatherChart } from './dailyWeatherChart'
import { useWindowDimensions } from '@/lib/hooks'
import {
    useForecastObjStore,
    useForecastSetStore,
    useSelectedForecastDay,
} from '@/lib/obj/forecastStore'

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
    if (chartHeight < 300) return 300
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
    forecastObj?: DailyWeatherForecastObjectType[]
    parentRef: React.RefObject<HTMLDivElement>
}
export const WeatherChart: React.FC<WeatherChartProps> = (
    props: WeatherChartProps
) => {
    const [chartType, setChartType] = React.useState<ChartTimespanType>('Day')
    const windowDimensions = useWindowDimensions()
    console.log('Chart Parent ref: ', props.parentRef)
    const chartDimensions: DimensionsType = {
        height: getChartHeight(props.parentRef.current?.clientHeight),
        width: getChartWidth(props.parentRef.current?.clientWidth),
    }
    const chartHeightPadding = 4
    console.log('chart dimensions: ', chartDimensions)
    const palette = useTheme().palette
    //For contrast text
    //const bgColor = useBackgroundColors()[props.forecastObj.timeOfDay!].sky
    //const contrastColor = palette.getContrastText(bgColor)

    //const chartDimensions = useChartDimensions(props)

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
    if (props.forecastObj?.[0] === undefined) return <div>Loading...</div>
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
                    position: 'relative',
                    backgroundColor: 'transparent',
                    '&::after': {
                        position: 'absolute',
                        content: '""',
                        top: '-0.5rem',
                        left: '0',
                        width: 'calc(100% + 1rem)',
                        height: 'calc(100% + 1rem)',
                        zIndex: 20,
                        //backgroundColor: 'green',
                        background: `${
                            palette.mode === 'dark'
                                ? 'rgba(0,0,0,0.2)'
                                : 'rgba(255,255,255,0.2)'
                        }`,
                        borderRadius: '16px',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                    },
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
                <div
                    className={styles.chartWrapper}
                    style={{
                        position: 'relative',
                        zIndex: 1000,
                    }}
                >
                    <ChartComponent
                        forecastObj={props.forecastObj}
                        chartKey={selectedVar}
                        chartType={chartType}
                        handleChartSelect={props.handleChartSelect}
                        selectedDay={props.selectedDay}
                        chartDimensions={chartDimensions}
                        textColor={'white'}
                    />
                    {/* {chartType === 'Week' ? ( */}
                    {/*     <DailyWeatherChart */}
                    {/*         forecast={props.forecast} */}
                    {/*         chartKey={selectedVar} */}
                    {/*         metadata={props.metadata} */}
                    {/*         handleChartSelect={props.handleChartSelect} */}
                    {/*         selectedDay={props.selectedDay} */}
                    {/*         chartDimensions={chartDimensions} */}
                    {/*         forecastObj={props.forecastObj} */}
                    {/*         textColor={contrastColor} */}
                    {/*     /> */}
                    {/* ) : ( */}
                    {/*     <HourlyWeatherChart */}
                    {/*         forecast={selectedForecast?.hourly_weather!} */}
                    {/*         chartKey={selectedVar} */}
                    {/*         metadata={props.metadata} */}
                    {/*         handleChartSelect={props.handleChartSelect} */}
                    {/*         selectedHour={props.selectedHour} */}
                    {/*         chartDimensions={chartDimensions} */}
                    {/*         forecastObj={props.forecastObj} */}
                    {/*         textColor={contrastColor} */}
                    {/*     /> */}
                    {/* )} */}
                </div>
            </Paper>
        </Box>
    )
}

interface ChartComponentProps {
    chartKey: ChartDataKeys
    chartType: ChartTimespanType
    handleChartSelect: (hour: number) => void
    selectedDay?: number
    chartDimensions: DimensionsType
    forecastObj?: DailyWeatherForecastObjectType[]
    textColor?: string
}

const ChartComponent: React.FC<ChartComponentProps> = (props) => {
    return props.forecastObj === undefined ||
        props.forecastObj[0] === undefined ? (
        <div>Loading...</div>
    ) : (
        <div className={styles.chartWrapper}>
            {props.chartType === 'Week' ? (
                <DailyWeatherChart
                    chartKey={props.chartKey}
                    //handleChartSelect={props.handleChartSelect}
                    chartDimensions={props.chartDimensions}
                    forecastObj={props.forecastObj}
                    textColor={props.textColor}
                />
            ) : (
                <HourlyWeatherChart
                    chartKey={props.chartKey}
                    //handleChartSelect={props.handleChartSelect}
                    chartDimensions={props.chartDimensions}
                    forecastObj={props.forecastObj}
                    textColor={props.textColor}
                />
            )}
        </div>
    )
}
