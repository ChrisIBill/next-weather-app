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
import { useEffect, useState } from 'react'
import { WeatherDataKeysMap } from '@/lib/records'
import { getDatetimeObject } from '@/lib/time'
import React from 'react'
import dayjs from 'dayjs'

export interface HourlyWeatherReportProps {
    forecast?: DailyWeatherForecastType
    selectedHour?: number
    handleTimeSelect?: (day?: number, hour?: number) => void
}
export const HourlyWeatherReport: React.FC<HourlyWeatherReportProps> = (
    props: HourlyWeatherReportProps
) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const el = React.useRef<HTMLTableRowElement>(null)
    const hourlyForecast = props.forecast?.hourly_weather
        ? props.forecast.hourly_weather
        : []
    const handleTimeSelect = props.handleTimeSelect
    const defaultTime = props.forecast?.current_weather?.time
        ? dayjs(props.forecast.current_weather.time).hour()
        : 11
    const scrollToElement = (element: any) => {
        element.current.scrollIntoView(true)
    }

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
            <TableRow
                sx={{
                    height: '1rem',
                }}
            >
                {props.keys.map((key) => {
                    if (WeatherDataKeysMap[key] === undefined) return null
                    const titleObj = WeatherDataKeysMap[key]
                    return (
                        <TableCell
                            key={key}
                            title={titleObj.long ? titleObj.long : ''}
                            padding="checkbox"
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(105, 101, 107,1)',
                                height: '1rem',
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
        useEffect(() => {
            let firstRender = true
            if (firstRender && el.current) {
                console.log('scrolling to element: ', el.current)
                scrollToElement(el)
                firstRender = false
            }
        }, [])
        return (
            <>
                {hourlyForecast.map((hour, index) => (
                    <tr
                        key={hour.time}
                        ref={index === defaultTime ? el : null}
                        onClick={() => {
                            handleTimeSelect?.(undefined, index)
                        }}
                    >
                        {props.keys.map((key) => {
                            if (hour[key] == undefined) return null
                            if (key === 'time') {
                                return (
                                    <TableCell size="medium" key={key} sx={{}}>
                                        {getDatetimeObject(hour[key]!).format(
                                            'hh:00 A'
                                        )}
                                    </TableCell>
                                )
                            }
                            return (
                                <TableCell size="medium" key={key}>
                                    {hour[key]}
                                </TableCell>
                            )
                        })}
                    </tr>
                ))}
            </>
        )
    }

    return (
        <div className={styles.wrapper}>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: '0.5rem',
                    margin: '1rem',
                    width: 'fit-content',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
