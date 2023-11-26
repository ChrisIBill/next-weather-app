import { DailyWeatherForecastType } from '@/lib/interfaces'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { ChartDataKeys } from './weatherChart'
import { useTheme } from '@/lib/context'
import paletteHandler from '@/lib/paletteHandler'
import dayjs from 'dayjs'

export interface DailyWeatherChartProps {
    forecast: DailyWeatherForecastType[]
    chartKey: ChartDataKeys
    metadata: any
    handleChartSelect: (day: number) => void
    selectedDay?: number
}
export const DailyWeatherChart: React.FC<DailyWeatherChartProps> = (
    props: DailyWeatherChartProps
) => {
    const theme = useTheme().theme
    const palette = paletteHandler(theme)
    const data = props.forecast.map((day, index) => {
        const time = dayjs(day.time).format('MM-DD')
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    day: time,
                    values: [day.temperature_2m_max, day.temperature_2m_min],
                }
            case 'Precipitation':
                return {
                    day: time,
                    values: [
                        day.precipitation_sum,
                        day.precipitation_probability_max,
                    ],
                }
            case 'Humidity':
                return {
                    day: time,
                    values: [day.humidity_max, day.humidity_min],
                }
            case 'Wind':
                return {
                    day: time,
                    values: [day.windspeed_10m_max, day.windgusts_10m_max],
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
        <BarChart width={800} height={400} data={data}>
            <XAxis
                dataKey="day"
                allowDataOverflow={true}
                interval={0}
                tickCount={8}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="values" fill={palette.primary} />
        </BarChart>
    )
}
