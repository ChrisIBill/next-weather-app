import {
    DailyWeatherForecastObjectType,
    DimensionsType,
} from '@/lib/interfaces'
import {
    setForecastHour,
    useForecastSetStore,
    useSelectedForecastDay,
} from '@/lib/obj/forecastStore'
import { convertToUserTemp } from '@/lib/obj/temperature'
import { useUserPrefsStore } from '@/lib/stores'
import { Typography, useTheme } from '@mui/material'
import {
    Area,
    AreaChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { ChartKeysType, legendPayloads } from './weatherChart'
import {
    CustomizedLegend,
    CustomizedTooltip,
    CustomizedYAxisTickGenerator,
} from './chartComponents'
import { useEffect, useState } from 'react'
import { MappableObject } from '@/lib/genInterfaces'
import { LegendWrapperStyle } from './chartStyles'

const HourlyChartColors = ['#EA79F6', '#9C74FB']

export interface HourlyWeatherChartProps {
    forecastObj: DailyWeatherForecastObjectType[]
    chartKey: ChartKeysType
    textColor?: string
    chartDimensions: DimensionsType
    parentRef: React.RefObject<HTMLDivElement>
}
export const HourlyWeatherChart: React.FC<HourlyWeatherChartProps> = (
    props: HourlyWeatherChartProps
) => {
    const [isMounted, setIsMounted] = useState(false)
    const wrapperDimensions = {
        ...props.chartDimensions,
    }
    const selectedForecastDay = useSelectedForecastDay(props.forecastObj)
    const setStateStore = useForecastSetStore()
    const palette = useTheme().palette
    const [isTemperature, isPrecipitation, isHumidity, isWind] = [
        props.chartKey === 'Temperature',
        props.chartKey === 'Precipitation',
        props.chartKey === 'Humidity',
        props.chartKey === 'Wind',
    ]
    const minActTemp = selectedForecastDay?.temperatureObj._celsiusRange[0] ?? 0
    const minAppTemp =
        selectedForecastDay?.temperatureObj._appCelsiusRange[0] ?? 0
    const minTemp = Math.min(minActTemp, minAppTemp) - 10
    const data = selectedForecastDay?.hourly_weather.map((hour, index) => {
        const time = hour.timeObj.dateObj.format('hh:mm A')
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    hour: time,
                    values: [
                        hour.temperatureObj._celsius,
                        hour.temperatureObj._appCelsius,
                    ],
                    temperature: hour.temperatureObj._celsius,
                    temperatureRange: [minTemp, hour.temperatureObj._celsius],
                    feelsLike: hour.temperatureObj._appCelsius,
                    apparentTemperatureRange: [
                        minTemp,
                        hour.temperatureObj._appCelsius,
                    ],
                }
            case 'Precipitation':
                return {
                    hour: time,
                    values: [hour.precipitationObj.chance],
                    chance: hour.precipitationObj.chance,
                    volume: hour.precipitationObj._mm,
                }
            case 'Humidity':
                return {
                    hour: time,
                }
            case 'Wind':
                return {
                    hour: time,
                    windSpeed: hour.windObj._kph[0],
                    windGust: hour.windObj._kph[1],
                    windDirection: hour.windObj.getCardinalDirection(),
                }
            default:
                return {
                    hour: 'Error',
                    values: [0, 0],
                }
        }
    })
    const handleChartClick = (nextState: any, e: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        const index = nextState.activeTooltipIndex
        const hour = selectedForecastDay?.hourly_weather[index]
        if (hour) setForecastHour(index, hour, setStateStore)
    }
    console.log('Data: ', data)

    const labelStrings: MappableObject = {
        Temperature: ['Temperature: ', 'Feels Like: '],
    }

    useEffect(() => {
        if (props.parentRef.current) {
            setIsMounted(true)
        }
    }, [props.parentRef])
    if (!isMounted) return null

    return (
        <ResponsiveContainer width="100%" aspect={2}>
            <AreaChart
                //width={wrapperDimensions.width}
                //height={wrapperDimensions.height}
                margin={{
                    top: 10,
                    right: 0,
                    left: 10,
                    bottom: 10,
                }}
                data={data}
                onClick={(nextState, e) => handleChartClick(nextState, e)}
                style={{
                    color: 'white',
                }}
                throttleDelay={100}
            >
                <XAxis
                    dataKey="hour"
                    interval={3}
                    tickCount={8}
                    color={palette.text.primary}
                    tick={{
                        fill: palette.text.primary,
                        fontSize: '0.9rem',
                    }}
                    axisLine={{
                        stroke: palette.text.primary,
                    }}
                />
                <YAxis
                    yAxisId="left"
                    domain={['dataMin', 'dataMax']}
                    tick={
                        <CustomizedYAxisTickGenerator
                            chartKey={props.chartKey}
                            fill={palette.text.primary}
                        />
                    }
                    axisLine={{
                        stroke: isPrecipitation
                            ? HourlyChartColors[1]
                            : palette.text.primary,
                    }}
                />
                <YAxis
                    yAxisId="right"
                    hide={!isPrecipitation}
                    domain={[0, 100]}
                    orientation="right"
                    tickFormatter={(value) => `${value}%`}
                    stroke={palette.text.primary}
                    axisLine={{
                        stroke: HourlyChartColors[0],
                    }}
                />
                <Tooltip
                    content={
                        <CustomizedTooltip
                            chartKey={props.chartKey}
                            labelStrings={labelStrings[props.chartKey]}
                        />
                    }
                />
                <Legend
                    verticalAlign="top"
                    layout="vertical"
                    // height={45}
                    content={<CustomizedLegend />}

                    // wrapperStyle={LegendWrapperStyle as React.CSSProperties}
                    // formatter={(value, entry, index) => {
                    //     return (
                    //         <Typography variant="caption" color="textPrimary">
                    //             {value}
                    //         </Typography>
                    //     )
                    // }}
                />
                <defs>
                    <linearGradient
                        // gradientUnits="userSpaceOnUse"
                        id="color0"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor={HourlyChartColors[0]}
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor={HourlyChartColors[0]}
                            stopOpacity={0}
                        />
                    </linearGradient>
                    <linearGradient
                        // gradientUnits="userSpaceOnUse"
                        id="color1"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                        style={{
                            position: 'absolute',
                            top: '0',
                            bottom: '0',
                        }}
                    >
                        <stop
                            offset="5%"
                            stopColor={HourlyChartColors[1]}
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor={HourlyChartColors[1]}
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <Area
                    name="Actual Temperature"
                    legendType={isTemperature ? 'line' : 'none'}
                    yAxisId="left"
                    hide={!isTemperature}
                    type="monotone"
                    dataKey="temperatureRange"
                    stroke={HourlyChartColors[0]}
                    fillOpacity={1}
                    fill="url(#color0)"
                />
                <Area
                    name="Apparent Temperature"
                    legendType={isTemperature ? 'line' : 'none'}
                    hide={!isTemperature}
                    yAxisId="left"
                    type="monotone"
                    dataKey="apparentTemperatureRange"
                    stroke={HourlyChartColors[1]}
                    fillOpacity={1}
                    fill="url(#color1)"
                />
                <Area
                    hide={!isPrecipitation}
                    legendType={isPrecipitation ? 'line' : 'none'}
                    name="Chance of Precipitation"
                    yAxisId="right"
                    type="monotone"
                    dataKey="chance"
                    stroke={HourlyChartColors[0]}
                    fillOpacity={1}
                    fill="url(#color0)"
                />
                <Area
                    hide={!isPrecipitation}
                    legendType={isPrecipitation ? 'line' : 'none'}
                    name="Precipitation Volume"
                    yAxisId="left"
                    type="monotone"
                    dataKey="volume"
                    stroke={HourlyChartColors[1]}
                    fillOpacity={1}
                    fill="url(#color1)"
                />
                <Area
                    hide={!isWind}
                    legendType={isWind ? 'line' : 'none'}
                    name="Wind Speed"
                    yAxisId="left"
                    type="monotone"
                    dataKey="windSpeed"
                    fillOpacity={1}
                    stroke={HourlyChartColors[0]}
                    fill="url(#color0)"
                />
                <Area
                    hide={!isWind}
                    legendType={isWind ? 'line' : 'none'}
                    name="Wind Gust"
                    yAxisId="left"
                    type="monotone"
                    stroke={HourlyChartColors[1]}
                    dataKey="windGust"
                    fillOpacity={1}
                    fill="url(#color1)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
