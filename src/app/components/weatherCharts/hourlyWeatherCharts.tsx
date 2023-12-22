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
import { useTheme } from '@mui/material'
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
    CustomizedTooltip,
    CustomizedYAxisTickGenerator,
    RenderToggler,
} from './chartComponents'
import { useEffect, useState } from 'react'
import { MappableObject } from '@/lib/genInterfaces'

const CHART_COLORS = ['#EA79F6', '#9C74FB']

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
        //height: props.parentRef.current?.offsetHeight ?? 0,
        //width: props.parentRef.current?.offsetWidth ?? 0,
        ...props.chartDimensions,
    }
    console.log('Wrapper Dimensions: ', wrapperDimensions)
    const selectedForecastDay = useSelectedForecastDay(props.forecastObj)
    const setStateStore = useForecastSetStore()
    const palette = useTheme().palette
    const [isTemperature, isPrecipitation, isHumidity, isWind] = [
        props.chartKey === 'Temperature',
        props.chartKey === 'Precipitation',
        props.chartKey === 'Humidity',
        props.chartKey === 'Wind',
    ]
    const isSmall = window.innerWidth < 600
    const isMedium = window.innerWidth < 900
    console.log('Selected Forecast Obj: ', selectedForecastDay)
    console.log('Forecast Obj: ', props.forecastObj)
    const data = selectedForecastDay?.hourly_weather.map((hour, index) => {
        console.log('Hour: ', hour)
        const time = hour.timeObj.dateObj.format('HH:mm')
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    hour: time,
                    values: [
                        hour.temperatureObj._celsius,
                        hour.temperatureObj._appCelsius,
                    ],
                    temperature: hour.temperatureObj._celsius,
                    feelsLike: hour.temperatureObj._appCelsius,
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

    const domainVal =
        props.chartKey == 'Precipitation' ? [0, 100] : ['auto', 'auto']

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
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 20,
                }}
                data={data}
                onClick={(nextState, e) => handleChartClick(nextState, e)}
                style={{
                    color: 'white',
                }}
            >
                <XAxis
                    dataKey="hour"
                    interval={3}
                    tickCount={8}
                    color={palette.text.primary}
                    tick={{
                        fill: palette.text.primary,
                        fontSize: isSmall ? 10 : 12,
                    }}
                />
                <YAxis
                    domain={domainVal}
                    yAxisId="left"
                    tick={
                        <CustomizedYAxisTickGenerator
                            chartKey={props.chartKey}
                            fill={palette.text.primary}
                        />
                    }
                />
                <YAxis
                    yAxisId="right"
                    hide={!isPrecipitation}
                    domain={['auto', 'auto']}
                    orientation="right"
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
                    height={38}
                    layout="vertical"
                    wrapperStyle={{
                        left: isSmall ? '200px' : '300px',
                        top: '-18px',
                    }}
                    // style={{
                    //     left: '300px',
                    //     top: '-18px',
                    // }}
                    //payload={legendPayloads[props.chartKey] as Payload[]}
                />
                <defs>
                    <linearGradient id="color0" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#890A97"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="#890A97"
                            stopOpacity={0}
                        />
                    </linearGradient>
                    <linearGradient id="color1" x1="" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#3704AD"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="#3704AD"
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
                    dataKey="temperature"
                    stroke={CHART_COLORS[0]}
                    fillOpacity={1}
                    fill="url(#color0)"
                />
                <Area
                    name="Apparent Temperature"
                    legendType={isTemperature ? 'line' : 'none'}
                    hide={!isTemperature}
                    yAxisId="left"
                    type="monotone"
                    dataKey="feelsLike"
                    stroke={CHART_COLORS[1]}
                    fillOpacity={1}
                    fill="url(#color1)"
                />
                <Area
                    hide={!isPrecipitation}
                    legendType={isPrecipitation ? 'line' : 'none'}
                    name="Chance of Precipitation"
                    yAxisId="left"
                    type="monotone"
                    dataKey="chance"
                    stroke={CHART_COLORS[0]}
                    fillOpacity={1}
                    fill="url(#color0)"
                />
                <Area
                    hide={!isPrecipitation}
                    legendType={isPrecipitation ? 'line' : 'none'}
                    name="Precipitation Volume"
                    yAxisId="right"
                    type="monotone"
                    dataKey="volume"
                    stroke={CHART_COLORS[1]}
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
                    stroke={CHART_COLORS[0]}
                    fill="url(#color0)"
                />
                <Area
                    hide={!isWind}
                    legendType={isWind ? 'line' : 'none'}
                    name="Wind Gust"
                    yAxisId="left"
                    type="monotone"
                    stroke={CHART_COLORS[1]}
                    dataKey="windGust"
                    fillOpacity={1}
                    fill="url(#color1)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
