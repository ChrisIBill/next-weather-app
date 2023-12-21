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
import { Payload } from 'recharts/types/component/DefaultLegendContent'
import { ResponsiveContainer } from 'recharts'

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

export interface LegendPayloadType {
    Temperature: {}
    Precipitation: {}
    Humidity: {}
    Wind: Payload[]
}

export const legendPayloads: LegendPayloadType = {
    Temperature: [
        { value: 'Actual Temperature', type: 'line', id: 'temperature' },
        {
            value: 'Apparent Temperature',
            type: 'line',
            id: 'appTemperature',
        },
    ],
    Precipitation: [
        { value: 'Chance of Precipitation', type: 'line', id: 'chance' },
        { value: 'Precipitation Volume', type: 'line', id: 'volume' },
    ],
    Wind: [
        { value: 'Wind Speed', type: 'line', id: 'windSpeed' },
        { value: 'Wind Gust', type: 'line', id: 'windGust' },
    ],
    Humidity: [{ value: 'Humidity', type: 'line', id: 'humidity' }],
}

const getWrapperWidth = (windowWidth?: number): number => {
    const chartWidth = windowWidth ?? 0
    //if (chartWidth < 600 && windowWidth) return windowWidth - 50
    return chartWidth
}

const getChartHeight = (windowHeight?: number) => {
    const chartHeight = windowHeight ? windowHeight : 300
    if (chartHeight < 150) return 150
    return chartHeight
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
        height: props.parentRef.current?.clientHeight ?? 25,
        width: props.parentRef.current?.clientWidth ?? 0,
    }
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
        //<Box
        //    className={styles.weatherChart}
        //    sx={{
        //        position: 'relative',
        //        width: '100%',
        //        height: '100%',
        //        padding: '8px',
        //        paddingRight: '0',
        //        marginRight: '1rem',
        //    }}
        //>
        <Paper
            className={styles.chartContainer}
            elevation={0}
            sx={{
                position: 'relative',
                backgroundColor: 'transparent',
                '&:after': {
                    position: 'absolute',
                    content: '""',
                    top: '-0.5rem',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    zIndex: 20,
                    background: `${
                        palette.mode === 'dark'
                            ? 'rgba(0,0,0,0.3)'
                            : 'rgba(50,50,50,0.2)'
                    }`,
                    borderRadius: '16px',
                    boxShadow: '3px 6px 12px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(5px)',
                },
            }}
        >
            <WeatherChartHeader
                selectedKey={selectedVar}
                selectedTimespan={chartType}
                chartKeys={['Temperature', 'Precipitation', 'Humidity', 'Wind']}
                handleKeySelect={handleChartKeyChange}
                handleTimespanSelect={handleChartTypeChange}
            />
            <ChartComponent
                forecastObj={props.forecastObj}
                chartKey={selectedVar}
                chartType={chartType}
                chartDimensions={chartDimensions}
                textColor={'white'}
            />
        </Paper>
        //</Box>
    )
}

interface ChartComponentProps {
    chartKey: ChartDataKeys
    chartType: ChartTimespanType
    chartDimensions: DimensionsType
    forecastObj?: DailyWeatherForecastObjectType[]
    textColor?: string
}

const ChartComponent: React.FC<ChartComponentProps> = (props) => {
    const chartWrapperRef = React.useRef<HTMLDivElement>(null)
    return props.forecastObj === undefined ||
        props.forecastObj[0] === undefined ? (
        <div>Loading...</div>
    ) : (
        <div
            ref={chartWrapperRef}
            className={styles.chartWrapper}
            style={{
                width: '100%',
                position: 'relative',
                zIndex: 1000,
                height: '100%',
                top: '-2rem',
            }}
        >
            {props.chartType === 'Week' ? (
                <DailyWeatherChart
                    chartKey={props.chartKey}
                    chartDimensions={props.chartDimensions}
                    forecastObj={props.forecastObj}
                    textColor={props.textColor}
                />
            ) : (
                <HourlyWeatherChart
                    chartKey={props.chartKey}
                    chartDimensions={props.chartDimensions}
                    forecastObj={props.forecastObj}
                    textColor={props.textColor}
                    parentRef={chartWrapperRef}
                />
            )}
        </div>
    )
}
