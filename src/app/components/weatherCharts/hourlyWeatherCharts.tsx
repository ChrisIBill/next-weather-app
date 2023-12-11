import {
    DailyWeatherForecastObjectType,
    DimensionsType,
} from '@/lib/interfaces'
import { convertToUserTemp } from '@/lib/obj/temperature'
import { useUserPrefsStore } from '@/lib/stores'
import { useTheme } from '@mui/material'
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts'

export interface HourlyWeatherChartProps {
    forecastObj: DailyWeatherForecastObjectType
    chartKey: string
    handleChartSelect: (day: number) => void
    textColor?: string
    chartDimensions: DimensionsType
}
export const HourlyWeatherChart: React.FC<HourlyWeatherChartProps> = (
    props
) => {
    const palette = useTheme().palette
    console.log('Forecast Obj: ', props.forecastObj)
    const data = props.forecastObj.hourly_weather.map((hour, index) => {
        const time = hour.timeObj.dateObj.format('HH:mm')
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    hour: time,
                    values: [
                        hour.temperatureObj._celsius,
                        hour.temperatureObj._appCelsius,
                    ],
                }
            case 'Precipitation':
                return {
                    hour: time,
                    values: [hour.precipitationObj.chance],
                }
            case 'Humidity':
                return {
                    hour: time,
                }
            case 'Wind':
                return {
                    hour: time,
                }
            default:
                return {
                    hour: 'Error',
                    values: [0, 0],
                }
        }
    })

    const domainVal =
        props.chartKey == 'Precipitation' ? [0, 100] : ['auto', 'auto']
    return (
        <AreaChart
            width={props.chartDimensions.width}
            height={props.chartDimensions.height - 42}
            data={data}
            style={{
                color: 'white',
            }}
        >
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
            </defs>
            <XAxis
                dataKey="hour"
                interval={3}
                tickCount={8}
                color={props.textColor}
                tick={{
                    fill: palette.text.secondary,
                }}
            />
            <YAxis
                domain={domainVal}
                tick={
                    <CustomizedYAxisTickGenerator chartKey={props.chartKey} />
                }
                //tick={{
                //    fill: palette.text.secondary,
                //}}
            />
            <Tooltip
                //
                content={<CustomizedTooltip chartKey={props.chartKey} />}
                //
            />
            <Area type="monotone" dataKey="values[0]" stroke="#8884d8" />
            <Area type="monotone" dataKey="values[1]" stroke="#82ca9d" />
        </AreaChart>
    )
}

interface CustomizedYAxisTickProps {
    chartKey: string
    [key: string]: any
}
const CustomizedYAxisTickGenerator: React.FC<CustomizedYAxisTickProps> = (
    props: CustomizedYAxisTickProps
) => {
    return (
        <text
            className={props.className}
            color={props.color}
            orientation="left"
            height={props.height}
            width={props.width}
            x={props.x}
            y={props.y}
            fill={props.fill}
            stroke={props.stroke}
            textAnchor={props.textAnchor}
        >
            <TickTextGenerator {...props} />
        </text>
    )
}
const TickTextGenerator: React.FC<any> = (props: any) => {
    switch (props.chartKey) {
        case 'Temperature':
            return <CustomizedYAxisTemperatureTick {...props} />
        case 'Precipitation':
            return <CustomizedYAxisPrecipitationTick {...props} />
        default:
            return <CustomizedYAxisTemperatureTick {...props} />
    }
}
const CustomizedYAxisTemperatureTick: React.FC<any> = (props: any) => {
    const tempUnit = useUserPrefsStore((state) => state.temperatureUnit)
    const temperatureString =
        convertToUserTemp(props.payload.value, tempUnit).toFixed(0) + tempUnit
    return (
        <tspan x={props.x} dy={'0.355em'}>
            {temperatureString}
        </tspan>
    )
}
const CustomizedYAxisPrecipitationTick: React.FC<any> = (props: any) => {
    //const precipUnit = useUserPrefsStore((state) => state.precipitationUnit)
    const precipitationString = props.payload.value + '%'
    return (
        <tspan x={props.x} dy={'0.355em'}>
            {precipitationString}
        </tspan>
    )
}
const CustomizedTooltip: React.FC<any> = (props: any) => {
    const palette = useTheme().palette
    const { payload, wrapperStyle, cursorStyle, labelStyle, ...styles } = props
    return (
        <div
            className={'recharts-default-tooltip'}
            style={{
                margin: '0px',
                padding: '10px',
                backgroundColor: palette.background.paper,
                whiteSpace: 'nowrap',
            }}
        >
            <p className={'recharts-tooltip-label'} style={{}}></p>
            <ul
                style={{
                    listStyleType: 'none',
                }}
            >
                <TooltipTextGenerator {...props} />
            </ul>
        </div>
    )
}
const TooltipTextGenerator: React.FC<any> = (props: any) => {
    switch (props.chartKey) {
        case 'Temperature':
            return <TemperatureTooltipContent {...props} />
        case 'Precipitation':
            return <GenericTooltipContent append={'%'} {...props} />
        default:
            return <GenericTooltipContent {...props} />
    }
}
const TemperatureTooltipContent: React.FC<any> = (props: any) => {
    const tempUnit = useUserPrefsStore((state) => state.temperatureUnit)
    const palette = useTheme().palette
    const { payload, label, active } = props
    return (
        <ul
            style={{
                listStyleType: 'none',
            }}
        >
            {payload.map((entry: any, index: number) => (
                <li
                    key={`item-${index}`}
                    style={{
                        ...entry,
                        color: palette.text.primary,
                    }}
                >
                    {(index == 1 ? 'Feels Like: ' : '') +
                        convertToUserTemp(entry.value, tempUnit).toFixed(0) +
                        tempUnit}
                </li>
            ))}
        </ul>
    )
}

const GenericTooltipContent: React.FC<any> = (props: any) => {
    const prepend = typeof props.prepend === 'string' ? props.prepend : ''
    const append = typeof props.append === 'string' ? props.append : ''
    const palette = useTheme().palette
    const { payload, label, active } = props
    return (
        <ul
            style={{
                listStyleType: 'none',
            }}
        >
            {payload.map((entry: any, index: number) => (
                <li
                    key={`item-${index}`}
                    style={{
                        ...entry,
                        color: palette.text.primary,
                    }}
                >
                    {prepend + entry.value + append}
                </li>
            ))}
        </ul>
    )
}
