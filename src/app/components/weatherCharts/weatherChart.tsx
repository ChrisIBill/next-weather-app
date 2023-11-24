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
    //false ? (
    //    <HourlyWeatherChart
    //        forecast={props.forecast[props.selectedDay].hourly_weather}
    //        key={selectedVar}
    //        metadata={props.metadata}
    //        handleChartSelect={props.handleChartSelect}
    //        selectedHour={props.selectedHour}
    //    />
    //) :
}

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

export interface WeatherChartControlsProps {
    chartKeys: ChartDataKeys[]
    selectedKey: ChartDataKeys
    chartWidth?: number
    handleKeySelect: (e: any, key: ChartDataKeys) => void
}

const drawerWidth = 160

const openMixin = (theme: any): CSSObject => ({
    transition: `${drawerWidth}px 225ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
    overflowX: 'hidden',
    width: `${drawerWidth}px`,
})

const closedMixin = (theme: any): CSSObject => ({
    transition: `${drawerWidth}px 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms`,
    overflowX: 'hidden',
    width: '2.5rem',
})
export const WeatherChartControls: React.FC<WeatherChartControlsProps> = (
    props
) => {
    const [open, setOpen] = React.useState<boolean>(true)
    const theme = useTheme().theme

    return (
        <Drawer
            variant="permanent"
            open={open}
            anchor="right"
            sx={{
                position: 'relative',
                top: '0',
                left: '0',
                ...(open && {
                    ...openMixin(theme),
                    '& .MuiPaper-root': openMixin(theme),
                }),
                ...(!open && {
                    ...closedMixin(theme),
                    '& .MuiPaper-root': closedMixin(theme),
                }),
                '& .MuiPaper-root': {
                    position: 'relative',
                    top: '0',
                    right: '0',
                },
            }}
            style={{}}
        >
            <div>
                <IconButton onClick={() => setOpen(!open)}>
                    {open ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {props.chartKeys.map((key) => (
                    <ListItem
                        key={key}
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'flex-start' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 0,
                                    justifyContent: 'center',
                                }}
                            >
                                {ChartIconsMap[key]}
                            </ListItemIcon>
                            <ListItemText
                                primary={key}
                                sx={{
                                    opacity: open ? 1 : 0,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}
