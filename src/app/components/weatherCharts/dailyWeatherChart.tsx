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
} from 'recharts'
import { ChartDataKeys } from './weatherChart'
import {
    CustomizedTooltip,
    CustomizedYAxisTickGenerator,
} from './chartComponents'
import { Typography, useTheme } from '@mui/material'
import { setForecastDay, useForecastSetStore } from '@/lib/obj/forecastStore'
import {
    USER_PREFERENCES_KEYS,
    UserPreferencesKeysType,
    useUserPrefsStore,
} from '@/lib/stores'
import { log } from 'next-axiom'
import { inspect } from 'util'
import { MappableObject } from '@/lib/genInterfaces'

export interface DailyWeatherChartProps {
    forecastObj: DailyWeatherForecastObjectType[]
    chartKey: ChartDataKeys
    textColor?: string
    chartDimensions: DimensionsType
}
export const DailyWeatherChart: React.FC<DailyWeatherChartProps> = (
    props: DailyWeatherChartProps
) => {
    log.debug('DailyWeatherChart props: ', {
        forecastObj: inspect(props.forecastObj),
        chartKey: props.chartKey,
        textColor: props.textColor,
        chartDimensions: props.chartDimensions,
    })
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
                    userTempRange: day.temperatureObj.getUserTempRange,
                    minTemp: day.temperatureObj._celsiusRange[0],
                    maxTempSubMin:
                        day.temperatureObj._celsiusRange[1] -
                        day.temperatureObj._celsiusRange[0],
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
            log.error('Error: day is undefined while handling chart click', {
                nextState,
            })
    }

    const labelStrings: MappableObject = {
        Temperature: ['Max Temp.', 'Min Temp.'],
        Precipitation: ['Chance: ', `Volume: `],
        Wind: ['Wind Speed', 'Gust Speed'],
    }
    const domainVal =
        props.chartKey === 'Precipitation' ? [0, 100] : ['auto', 'auto']
    log.debug('DailyWeatherChart data: ', data)
    return (
        <BarChart
            width={props.chartDimensions.width}
            height={props.chartDimensions.height - 42}
            data={data}
            onClick={handleChartClick}
        >
            <XAxis
                dataKey="day"
                allowDataOverflow={true}
                interval={0}
                tickCount={8}
            />
            <YAxis
                domain={domainVal}
                tick={
                    <CustomizedYAxisTickGenerator
                        chartKey={props.chartKey}
                        fill={palette.text.primary}
                    />
                }
            />
            <Legend verticalAlign="top" />
            <Tooltip
                content={
                    <CustomizedTooltip
                        chartKey={props.chartKey}
                        labelStrings={labelStrings[props.chartKey]}
                    />
                }
            />
            <Bar
                name="Min Temp."
                hide={props.chartKey !== 'Temperature'}
                legendType={props.chartKey === 'Temperature' ? 'line' : 'none'}
                dataKey="minTemp"
                fill="#430ED5"
                stackId="Temperature"
            ></Bar>
            <Bar
                name="Max Temp."
                hide={props.chartKey !== 'Temperature'}
                legendType={props.chartKey === 'Temperature' ? 'line' : 'none'}
                dataKey="maxTempSubMin"
                fill="#680872"
                stackId="Temperature"
            >
                <GenericStateLabelList dataKey="maxLabel" />
            </Bar>
            {/* Precipitation */}
            <Bar
                name="% of Precip."
                hide={props.chartKey !== 'Precipitation'}
                legendType={
                    props.chartKey === 'Precipitation' ? 'line' : 'none'
                }
                dataKey="chanceOfRain"
                fill="#680872"
            ></Bar>
            <Bar
                name={`${precipUnit} of Precip.`}
                hide={props.chartKey !== 'Precipitation'}
                legendType={
                    props.chartKey === 'Precipitation' ? 'line' : 'none'
                }
                dataKey="volumeOfRain"
                fill="#430ED5"
            >
                <GenericStateLabelList dataKey="volumeLabel" />
            </Bar>
            {/* Wind */}
            <Bar
                name="Wind Speed"
                hide={props.chartKey !== 'Wind'}
                legendType={props.chartKey === 'Wind' ? 'line' : 'none'}
                dataKey="windSpeed"
                fill="#680872"
                stackId="Wind"
            >
                <GenericStateLabelList dataKey="windLabel" />
            </Bar>
            <Bar
                name="Gust Speed"
                hide={props.chartKey !== 'Wind'}
                legendType={props.chartKey === 'Wind' ? 'line' : 'none'}
                dataKey="gustSpeedSubWind"
                fill="#430ED5"
                stackId="Wind"
            >
                <GenericStateLabelList dataKey="gustLabel" />
            </Bar>
        </BarChart>
    )
}

const barKeyToStateMap: MappableObject = {
    minLabel: 'temperatureUnit',
    maxLabel: 'temperatureUnit',
    volumeLabel: 'precipitationUnit',
    windLabel: 'windUnit',
    gustLabel: 'windUnit',
}

export const GenericStateLabelList: React.FC<MappableObject> = (props) => {
    const stateString = barKeyToStateMap[props.dataKey]
    if (!stateString || !USER_PREFERENCES_KEYS.includes(stateString))
        throw new Error(
            `Invalid dataKey ${props.dataKey} in GenericStateLabelList`
        )
    const state = useUserPrefsStore(
        (state) => state[stateString as UserPreferencesKeysType]
    )
    console.log('GenericStateLabelList', { stateString, state })

    const palette = useTheme().palette
    if (!props.dataKey) return null
    return (
        <text fill={props.textColor ?? palette.text.primary}>
            {props.value}
        </text>
    )
}

const chartKeyToStateMap: MappableObject = {
    Temperature: 'temperatureUnit',
    Precipitation: 'precipitationUnit',
    Wind: 'windUnit',
}

export const TemperatureLabelList: React.FC<MappableObject> = (props) => {
    console.log('TemperatureLabelList', { props })
    const temperatureUnit = useUserPrefsStore((state) => state.temperatureUnit)
    const palette = useTheme().palette
    return (
        <LabelList
            dataKey={props.dataKey}
            fill={props.textColor ?? palette.text.primary}
            formatter={(value) => `${value} ${temperatureUnit}`}
            {...props.otherProps}
        />
    )
}

const DailyTooltipGenerator: React.FC<MappableObject> = (props) => {
    console.log('DailyTooltipGenerator', { props })
    const stateString = chartKeyToStateMap[props.chartKey]
    const state = useUserPrefsStore(
        (state) => state[stateString as UserPreferencesKeysType]
    )
    const palette = useTheme().palette
    const { payload, label, active } = props
    if (!props.chartKey || !state) return null
    return (
        <Tooltip
            cursor={{ fill: palette.text.primary }}
            {...props.otherProps}
        />
    )
}

//const GenericStateTooltip: React.FC<MappableObject> = (props) => {
//    console.log('GenericStateTooltip', { props })
//    const stateString = chartKeyToStateMap[props.dataKey]
//    const state = useUserPrefsStore(
//        (state) => state[stateString as UserPreferencesKeysType]
//    )
//    const palette = useTheme().palette
//    const { payload, label, active } = props
//
//
//    if (!props.dataKey || !state) return null
//    return (
//        <
//    )
//}
