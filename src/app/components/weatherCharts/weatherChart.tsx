import React, { useEffect } from 'react'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import {
    DailyWeatherForecastType,
    DetailedWeatherDataType,
    HourlyWeatherDataType,
} from '@/lib/interfaces'
import styles from './weatherChart.module.scss'
import {
    Box,
    CSSObject,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Tab,
    Tabs,
} from '@mui/material'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { WiRaindrops, WiHumidity, WiThermometer } from 'react-icons/wi'
import { LuWind } from 'react-icons/lu'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useTheme } from '@/lib/context'
import { WeatherChartControls } from './chartComponents'
import { HourlyWeatherChart } from './hourlyWeatherCharts'
import { DailyWeatherChart } from './dailyWeatherChart'
export type ChartDataKeys =
    | 'Temperature'
    | 'Precipitation'
    | 'Humidity'
    | 'Wind'
export const ChartIconsMap = {
    Temperature: <WiThermometer />,
    Precipitation: <WiRaindrops />,
    Humidity: <WiHumidity />,
    Wind: <LuWind />,
}

function getChartDataFromForecast(
    forecast: DetailedWeatherDataType[],
    key: ChartDataKeys
) {
    const forecastKey = () => {
        switch (key) {
            case 'Temperature':
                return 'temperature_2m'
            case 'Precipitation':
                return 'precipitation'
            case 'Humidity':
                return 'humidity'
            case 'Wind':
                return 'wind'
        }
    }
    //return forecast.map(())
}
export interface WeatherChartProps {
    forecast: DailyWeatherForecastType[]
    metadata: any
    handleChartSelect: (day: number) => void
    selectedDay?: number
    selectedHour?: number
}
export const WeatherChart: React.FC<WeatherChartProps> = (props) => {
    const [chartType, setChartType] = React.useState<'Day' | 'Week'>('Day')
    const selectedForecast = props.selectedDay
        ? props.forecast[props.selectedDay]
        : props.forecast[0]
    const [selectedVar, setSelectedVar] =
        React.useState<ChartDataKeys>('Temperature')

    const handleChartTypeChange = (e: any, val: any) => {
        setChartType(val)
    }
    const handleChartKeyChange = (e: any, val: any) => {
        setSelectedVar(val)
    }
    if (props.forecast[0] === undefined) return <div>Loading...</div>
    return (
        <Box
            className={styles.weatherChart}
            sx={{
                width: '850px',
                height: '450px',
            }}
        >
            <Paper className={styles.chartContainer}>
                <Tabs
                    value={chartType}
                    onChange={handleChartTypeChange}
                    sx={{
                        color: 'black',
                    }}
                >
                    <Tab label="Day" value="Day" />
                    <Tab label="Week" value="Week" />
                </Tabs>
                <div className={styles.chartWrapper}>
                    {chartType === 'Week' ? (
                        <DailyWeatherChart
                            forecast={props.forecast}
                            chartKey={selectedVar}
                            metadata={props.metadata}
                            handleChartSelect={props.handleChartSelect}
                            selectedDay={props.selectedDay}
                        />
                    ) : (
                        <HourlyWeatherChart
                            forecast={selectedForecast?.hourly_weather!}
                            chartKey={selectedVar}
                            metadata={props.metadata}
                            handleChartSelect={props.handleChartSelect}
                            selectedHour={props.selectedHour}
                        />
                    )}
                </div>
            </Paper>
            <WeatherChartControls
                chartKeys={['Temperature', 'Precipitation', 'Humidity', 'Wind']}
                selectedKey={selectedVar}
                chartWidth={850}
                handleKeySelect={handleChartKeyChange}
            />
        </Box>
    )
}
