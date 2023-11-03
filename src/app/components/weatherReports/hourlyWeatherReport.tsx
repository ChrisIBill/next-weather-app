import { DailyWeatherForecastType } from '@/lib/interfaces'
import styles from './hourlyWeatherReport.module.css'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { useState } from 'react'
import { WeatherDataKeysMap } from '@/lib/records'
import { getDatetimeObject } from '@/lib/time'

export interface HourlyWeatherReportProps {
    forecast?: DailyWeatherForecastType
    selectedHour?: number
    handleTimeSelect?: (day?: number, hour?: number) => void
}
export const HourlyWeatherReport: React.FC<HourlyWeatherReportProps> = (
    props: HourlyWeatherReportProps
) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const hourlyForecast = props.forecast?.hourly_weather
    const handleTimeSelect = props.handleTimeSelect
    if (!hourlyForecast) return null

    const denseKeys = [
        'time',
        'temperature_2m',
        'precipitation_probability',
        'precipitation',
        'windspeed_10m',
        'windgusts_10m',
        'uv_index',
        'visibility',
        'weathercode',
    ]
    const propKeys = isExpanded ? Object.keys(hourlyForecast[0]) : denseKeys
    interface TableProps {
        keys: string[]
    }
    const TableHeader: React.FC<TableProps> = (props: TableProps) => {
        return (
            <TableRow>
                {props.keys.map((key) => {
                    if (WeatherDataKeysMap[key] === undefined) return null
                    const titleObj = WeatherDataKeysMap[key]
                    return (
                        <TableCell
                            key={key}
                            title={titleObj.long ? titleObj.long : ''}
                            sx={{
                                backgroundColor: 'rgba(105, 101, 107,1)',
                            }}
                        >
                            {titleObj.short}
                        </TableCell>
                    )
                })}
            </TableRow>
        )
    }
    const TableContent: React.FC<TableProps> = (props: TableProps) => {
        return (
            <>
                {hourlyForecast.map((hour, index) => (
                    <TableRow
                        key={hour.time}
                        sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                        }}
                        onClick={() => {
                            handleTimeSelect?.(undefined, index)
                        }}
                    >
                        {props.keys.map((key) => {
                            if (hour[key] == undefined) return null
                            if (key === 'time') {
                                return (
                                    <TableCell key={key}>
                                        {getDatetimeObject(hour[key]!).format(
                                            'hh:00 A'
                                        )}
                                    </TableCell>
                                )
                            }
                            return <TableCell key={key}>{hour[key]}</TableCell>
                        })}
                    </TableRow>
                ))}
            </>
        )
    }
    return (
        <div className={styles.wrapper}>
            <TableContainer
                component={Paper}
                sx={{
                    width: 'fit-content',
                    backgroundColor: 'transparent',
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minHeight: 0,
                        minWidth: 650,
                    }}
                    aria-label="hourly report table"
                >
                    <TableHead sx={{}}>
                        <TableHeader keys={propKeys} />
                    </TableHead>
                    <TableBody
                        sx={{
                            position: 'relative',
                            zIndex: 0,
                            maxHeight: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <TableContent keys={propKeys} />
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
