import {
    DailyWeatherForecastObjectType,
    DimensionsType,
} from '@/lib/interfaces'
import {
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    LabelList,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { ChartDataKeys } from './weatherChart'
import {
    ChartLogger,
    CustomizedLegend,
    CustomizedTooltip,
    CustomizedYAxisTickGenerator,
    RenderShape,
} from './chartComponents'
import { Typography, useTheme } from '@mui/material'
import { setForecastDay, useForecastSetStore } from '@/lib/obj/forecastStore'
import {
    USER_PREFERENCES_KEYS,
    UserPreferencesKeysType,
    useUserPrefsStore,
} from '@/lib/stores'
import { MappableObject } from '@/lib/genInterfaces'
import { LegendWrapperStyle } from './chartStyles'
import { convertToUserUnit } from '@/lib/obj/forecastClass'

export interface DailyWeatherChartProps {
    forecastObj: DailyWeatherForecastObjectType[]
    chartKey: ChartDataKeys
    textColor?: string
    chartDimensions: DimensionsType
}
const DailyChartColors = ['#680872', '#430ED5']

const DailyWeatherChartLogger = ChartLogger.child({ component: 'DailyChart' })

export const DailyWeatherChart: React.FC<DailyWeatherChartProps> = (
    props: DailyWeatherChartProps
) => {
    DailyWeatherChartLogger.debug('Rendering DailyWeatherChart', { props })
    const precipUnit = useUserPrefsStore((state) => state.precipitationUnit)
    const palette = useTheme().palette
    const setForecastStore = useForecastSetStore()
    const data = props.forecastObj.map((day, index) => {
        const time = day.timeObj.dateObj.format('MM-DD')
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    day: time,
                    minLabel: day.temperatureObj.getUserTempRange?.()[0],
                    maxLabel: day.temperatureObj.getUserTempRange?.()[1],
                    minTemp: day.temperatureObj._celsiusRange[0],
                    maxTemp: day.temperatureObj._celsiusRange[1],
                    tempRange: day.temperatureObj._celsiusRange,
                }
            case 'Precipitation':
                return {
                    day: time,
                    volumeLabel: day.precipitationObj?.getUserValue(),
                    chanceOfRain: day.precipitationObj.chance,
                    volumeOfRain: day.precipitationObj._mm,
                }
            case 'Humidity':
                return {
                    day: time,
                    values: [0, 0],
                }
            case 'Wind':
                return {
                    day: time,
                    windLabel: day.windObj.getSpeed(),
                    gustLabel: day.windObj.getGustSpeed(),
                    windSpeed: day.windObj._kph[0],
                    gustSpeedSubWind: day.windObj._kph[1] - day.windObj._kph[0],
                    values: [day.windObj._kph[0], day.windObj._kph[1]],
                }
            default:
                return {
                    day: 'Error',
                    values: [0, 0],
                }
        }
    })
    const handleChartClick = (nextState: any, e: any) => {
        const index = nextState.activeTooltipIndex
        const day = props.forecastObj[index] ?? undefined
        if (day) setForecastDay(index, day, setForecastStore, palette.mode)
        else
            DailyWeatherChartLogger.error(
                'Error: day is undefined while handling chart click',
                {
                    nextState,
                }
            )
    }

    const labelStrings: MappableObject = {
        Temperature: ['Min Temp.', 'Max Temp.'],
        Precipitation: ['Chance', `Volume`],
        Wind: ['Wind Speed', 'Gust Speed'],
    }
    const domainVal =
        props.chartKey === 'Precipitation' ? [0, 100] : ['auto', 'auto']
    DailyWeatherChartLogger.debug('DailyWeatherChart data: ', data)
    return (
        <ResponsiveContainer width="100%" aspect={2}>
            <BarChart
                data={data}
                onClick={handleChartClick}
                margin={{
                    top: 10,
                    right: 0,
                    left: 10,
                    bottom: 10,
                }}
                throttleDelay={100}
            >
                <XAxis
                    dataKey="day"
                    allowDataOverflow={true}
                    interval={0}
                    tickCount={8}
                    tick={{ fill: palette.text.primary }}
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
                        stroke:
                            props.chartKey === 'Precipitation'
                                ? DailyChartColors[1]
                                : palette.text.primary,
                    }}
                />
                <YAxis
                    yAxisId="right"
                    hide={props.chartKey !== 'Precipitation'}
                    domain={domainVal}
                    orientation="right"
                    stroke={palette.text.primary}
                    tickFormatter={(value) =>
                        value + (props.chartKey === 'Precipitation' ? '%' : '')
                    }
                    axisLine={{
                        stroke:
                            props.chartKey === 'Precipitation'
                                ? DailyChartColors[0]
                                : palette.text.primary,
                    }}
                />
                <Legend
                    //height={1}
                    verticalAlign="top"
                    layout="vertical"
                    content={<CustomizedLegend />}
                    wrapperStyle={
                        {
                            ...LegendWrapperStyle,
                            display:
                                props.chartKey === 'Temperature'
                                    ? 'none'
                                    : 'flex',
                        } as React.CSSProperties
                    }
                    // formatter={(value, entry, index) => {
                    //     return (
                    //         <Typography variant="caption" color="textPrimary">
                    //             {value}
                    //         </Typography>
                    //     )
                    // }}
                />
                <Tooltip
                    content={
                        <CustomizedTooltip
                            chartKey={props.chartKey}
                            labelStrings={labelStrings[props.chartKey]}
                        />
                    }
                />
                <defs>
                    <linearGradient
                        id="temperature"
                        x1="0"
                        y1="0%"
                        x2="0"
                        y2="100%"
                        style={{
                            position: 'absolute',
                            top: '0',
                            bottom: '0',
                        }}
                    >
                        <stop
                            offset="5%"
                            stopColor={DailyChartColors[0]}
                            stopOpacity={1}
                        />
                        <stop
                            offset="95%"
                            stopColor={DailyChartColors[1]}
                            stopOpacity={1}
                        />
                    </linearGradient>
                </defs>
                {/* Temperature */}
                <Bar
                    name="Temperature Range"
                    hide={props.chartKey !== 'Temperature'}
                    legendType={'none'}
                    dataKey="tempRange"
                    //fill="url(#temperature)"
                    shape={
                        <RenderShape
                            gradientKey="temperature"
                            startColor={DailyChartColors[1]}
                            stopColor={DailyChartColors[0]}
                        />
                    }
                    yAxisId="left"
                >
                    <LabelList
                        position="insideTop"
                        content={
                            <RenderGenericStateLabel chartKey="tempRange" />
                        }
                        dataKey="maxTemp"
                    />
                    <LabelList
                        position="insideBottom"
                        content={
                            <RenderGenericStateLabel chartKey="tempRange" />
                        }
                        dataKey="minTemp"
                    />
                </Bar>
                <Bar
                    name="% of Precip."
                    hide={props.chartKey !== 'Precipitation'}
                    legendType={
                        props.chartKey === 'Precipitation' ? 'line' : 'none'
                    }
                    dataKey="chanceOfRain"
                    fill="#680872"
                    yAxisId="right"
                >
                    <LabelList
                        position="insideTop"
                        fill={palette.text.primary}
                        formatter={(value: number) =>
                            value ? value + '%' : ''
                        }
                    />
                </Bar>
                <Bar
                    name={`${precipUnit} of Precip.`}
                    hide={props.chartKey !== 'Precipitation'}
                    legendType={
                        props.chartKey === 'Precipitation' ? 'line' : 'none'
                    }
                    dataKey="volumeOfRain"
                    fill="#430ED5"
                    yAxisId="left"
                >
                    <LabelList
                        position="insideTop"
                        content={
                            <RenderGenericStateLabel chartKey="volumeLabel" />
                        }
                    />
                </Bar>
                {/* Wind */}
                <Bar
                    name="Wind Speed"
                    hide={props.chartKey !== 'Wind'}
                    legendType={props.chartKey === 'Wind' ? 'line' : 'none'}
                    dataKey="windSpeed"
                    fill="#680872"
                    stackId="Wind"
                    yAxisId="left"
                >
                    <LabelList
                        position="insideTop"
                        content={
                            <RenderGenericStateLabel chartKey="windLabel" />
                        }
                    />
                </Bar>
                <Bar
                    name="Gust Speed"
                    hide={props.chartKey !== 'Wind'}
                    legendType={props.chartKey === 'Wind' ? 'line' : 'none'}
                    dataKey="gustSpeedSubWind"
                    fill="#430ED5"
                    stackId="Wind"
                    yAxisId="left"
                >
                    <LabelList
                        position="insideTop"
                        content={
                            <RenderGenericStateLabel chartKey="gustLabel" />
                        }
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

const barKeyToStateMap: MappableObject = {
    tempRange: 'temperatureUnit',
    maxLabel: 'temperatureUnit',
    volumeLabel: 'precipitationUnit',
    windLabel: 'windUnit',
    gustLabel: 'windUnit',
}

const RenderGenericStateLabel = (props: any) => {
    const { x, y, width, height, value, index, chartKey, position } = props
    const posY = () => {
        switch (position) {
            case 'top':
                return y as number
            case 'bottom':
                return (y + height + 12) as number
            case 'insideTop':
                return (y + 15) as number
            case 'insideBottom':
                return (y + height - 3) as number
            default:
                return y as number
        }
    }
    const stateString = barKeyToStateMap[chartKey]
    const state = useUserPrefsStore(
        (state) => state[stateString as UserPreferencesKeysType]
    )
    const palette = useTheme().palette
    if (index === 0)
        DailyWeatherChartLogger.debug('RenderGenericChartLabel', {
            stateString,
            state,
            props,
            posY: posY(),
        })
    if (typeof state === 'number') {
        DailyWeatherChartLogger.error(
            `Invalid state ${state} in RenderGenericStateLabel for ${stateString}`
        )
        throw new Error(
            `Invalid state ${state} in RenderGenericStateLabel for ${stateString}`
        )
    }
    return (
        <g>
            <text
                x={x + width / 2}
                y={posY()}
                textAnchor="middle"
                fill={palette.text.primary}
            >
                {value ? convertToUserUnit(value, state) + '' + state : ''}
            </text>
        </g>
    )
}

export const TemperatureLabelList: React.FC<MappableObject> = (props) => {
    const temperatureUnit = useUserPrefsStore((state) => state.temperatureUnit)
    const palette = useTheme().palette
    return <LabelList dataKey={props.dataKey} position={props.position} />
}
