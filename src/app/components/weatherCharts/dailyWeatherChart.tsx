import {
    DailyWeatherForecastObjectType,
    DailyWeatherForecastType,
    DimensionsType,
} from '@/lib/interfaces'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { ChartDataKeys } from './weatherChart'
import paletteHandler from '@/lib/paletteHandler'
import dayjs from 'dayjs'
import { useTheme } from '@mui/material'

export interface DailyWeatherChartProps {
    forecastObj: DailyWeatherForecastObjectType[]
    chartKey: ChartDataKeys
    handleChartSelect: (day: number) => void
    textColor?: string
    chartDimensions: DimensionsType
}
export const DailyWeatherChart: React.FC<DailyWeatherChartProps> = (
    props: DailyWeatherChartProps
) => {
    const palette = useTheme().palette
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
                    values: [day.precipitationObj.chance],
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
    console.log('chart data: ', data)
    return (
        <BarChart
            width={props.chartDimensions.width}
            height={props.chartDimensions.height - 42}
            data={data}
        >
            <XAxis
                dataKey="day"
                allowDataOverflow={true}
                interval={0}
                tickCount={8}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="values" fill={palette.primary.main} />
        </BarChart>
    )
}
