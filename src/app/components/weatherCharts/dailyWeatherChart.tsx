import {
    DailyWeatherForecastObjectType,
    DailyWeatherForecastType,
    DimensionsType,
} from '@/lib/interfaces'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { ChartDataKeys } from './weatherChart'
import paletteHandler from '@/lib/paletteHandler'
import dayjs from 'dayjs'
import { CustomizedYAxisTickGenerator } from './chartComponents'
import { useTheme } from '@mui/material'
import { setForecastDay, useForecastSetStore } from '@/lib/obj/forecastStore'

export interface DailyWeatherChartProps {
    forecastObj: DailyWeatherForecastObjectType[]
    chartKey: ChartDataKeys
    textColor?: string
    chartDimensions: DimensionsType
}
export const DailyWeatherChart: React.FC<DailyWeatherChartProps> = (
    props: DailyWeatherChartProps
) => {
    const palette = useTheme().palette
    const setForecastStore = useForecastSetStore()
    const data = props.forecastObj.map((day, index) => {
        const time = day.timeObj.dateObj.format('MM-DD')
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    day: time,
                    values: [
                        day.temperatureObj._celsiusRange[0],
                        day.temperatureObj._celsiusRange[1],
                    ],
                }
            case 'Precipitation':
                return {
                    day: time,
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
                    values: [0, 0],
                }
            default:
                return {
                    day: 'Error',
                    values: [0, 0],
                }
        }
    })
    const handleChartClick = (nextState: any, e: any) => {
        console.log('Daily chart nextState: ', nextState, e)
        const index = nextState.activeTooltipIndex
        const day = props.forecastObj[index] ?? undefined
        if (day) setForecastDay(index, day, setForecastStore, palette.mode)
    }
    const domainVal =
        props.chartKey === 'Precipitation' ? [0, 100] : ['auto', 'auto']
    console.log('chart data: ', data)
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
            <Tooltip />
            <Bar
                hide={props.chartKey === 'Precipitation'}
                dataKey="values"
                fill="#680872"
            />
            <Bar
                hide={props.chartKey !== 'Precipitation'}
                dataKey="chanceOfRain"
                fill="#680872"
            />
            <Bar
                hide={props.chartKey !== 'Precipitation'}
                dataKey="volumeOfRain"
                fill="#680872"
            />
        </BarChart>
    )
}

interface DailyWeatherChartBarProps {
    chartKey: ChartDataKeys
}

const DailyWeatherChartBars: React.FC<DailyWeatherChartBarProps> = (
    props: DailyWeatherChartBarProps
) => {
    console.log('Bars Chart key: ', props.chartKey)
    switch (props.chartKey) {
        case 'Precipitation':
            return <DailyWeatherChartPrecipitationBars {...props} />
        default:
            return <DailyWeatherChartGenericBars {...props} />
    }
}

const DailyWeatherChartGenericBars: React.FC<DailyWeatherChartBarProps> = (
    props: DailyWeatherChartBarProps
) => {
    console.log('Generic chart props: ', props)
    return (
        <>
            <Bar dataKey="values" fill="#680872" />
        </>
    )
}
const DailyWeatherChartPrecipitationBars: React.FC<
    DailyWeatherChartBarProps
> = (props: DailyWeatherChartBarProps) => {
    console.log('Precipitation chart props: ', props)

    return (
        <>
            <Bar dataKey="values[0]" fill="#680872" />
            <Bar dataKey="values[1]" fill="#680872" />
        </>
    )
}
