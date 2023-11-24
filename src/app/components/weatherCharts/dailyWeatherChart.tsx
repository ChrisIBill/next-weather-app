import { DailyWeatherForecastType } from '@/lib/interfaces'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { ChartDataKeys } from './weatherChart'

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
    const data = props.forecast.map((day, index) => {
        console.log('chart map day: ', day, index)
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    day: day.time,
                    values: [day.temperature_2m_max, day.temperature_2m_min],
                }
            case 'Precipitation':
                return {
                    day: day.time,
                    values: [
                        day.precipitation_sum,
                        day.precipitation_probability_max,
                    ],
                }
            case 'Humidity':
                return {
                    day: day.time,
                    values: [day.humidity_max, day.humidity_min],
                }
            case 'Wind':
                return {
                    day: day.time,
                    values: [day.windspeed_10m_max, day.windgusts_10m_max],
                }
            default:
                return {
                    day: 'Error',
                    values: [0, 0],
                }
        }
    })
    return (
        <BarChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="values" fill="#ffffff" />
        </BarChart>
    )
}
