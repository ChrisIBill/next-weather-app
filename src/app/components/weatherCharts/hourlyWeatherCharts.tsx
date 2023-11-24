import { HourlyWeatherDataType } from '@/lib/interfaces'
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts'

export interface HourlyWeatherChartProps {
    forecast: HourlyWeatherDataType[]
    chartKey: string
    metadata: any
    handleChartSelect: (day: number) => void
    selectedHour?: number
}
export const HourlyWeatherChart: React.FC<HourlyWeatherChartProps> = (
    props
) => {
    const data = props.forecast.map((hour, index) => {
        switch (props.chartKey) {
            case 'Temperature':
                return {
                    hour: hour.time,
                    values: [hour.temperature_2m, hour.apparent_temperature],
                }
            case 'Precipitation':
                return {
                    hour: hour.time,
                    values: [
                        hour.precipitation,
                        hour.precipitation_probability,
                    ],
                }
            case 'Humidity':
                return {
                    hour: hour.time,
                    values: [hour.humidity],
                }
            case 'Wind':
                return {
                    hour: hour.time,
                    values: [hour.windspeed_10m, hour.windgusts_10m],
                }
            default:
                return {
                    hour: 'Error',
                    values: [0, 0],
                }
        }
    })
    return (
        <AreaChart width={800} height={400} data={data}>
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
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="values[0]" stroke="#8884d8" />
            <Area type="monotone" dataKey="values[1]" stroke="#82ca9d" />
        </AreaChart>
    )
}
