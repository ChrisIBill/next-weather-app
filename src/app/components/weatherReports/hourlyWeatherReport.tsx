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
import { useTheme } from '@/lib/context'
import paletteHandler from '@/lib/paletteHandler'

export interface HourlyWeatherReportProps {
    forecast?: DailyWeatherForecastType
    selectedHour?: number
    handleTimeSelect?: (day?: number, hour?: number) => void
}
export const HourlyWeatherReport: React.FC<HourlyWeatherReportProps> = (
    props: HourlyWeatherReportProps
) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    const theme = useTheme()
    const palette = paletteHandler(theme.theme)

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

    const numColumns = propKeys.length
    const columnWidth = 100 / numColumns
    interface TableProps {
        keys: string[]
    }
    const TableHeader: React.FC<TableProps> = (props: TableProps) => {
        return (
            <TableRow
                sx={{
                    height: '2rem',
                    //position: 'sticky',
                    //top: 0,
                    //left: 0,
                    //right: 0,
                    //bottom: 0,
                    //background: `linear-gradient(
                    //                180deg,
                    //                ${palette.background},
                    //                ${palette.secondary}
                    //            )`,
                    //color: palette.textPrimary,
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
                                background: `linear-gradient(
                                    5deg,
                                    ${palette.background},
                                    ${palette.secondary}
                                )`,
                                boxShadow: '0 0 1rem rgba(0, 0, 0, 0.5)',
                                color: palette.textPrimary,
                                height: '1rem',
                                width: columnWidth + '%',
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
                        style={{
                            color: palette.textPrimary,
                            //borderRight: `1px solid ${palette.textPrimary}`,
                            //borderLeft: `1px solid ${palette.textPrimary}`,
                        }}
                    >
                        {props.keys.map((key) => {
                            console.log('Type of key: ', typeof hour[key])
                            if (hour[key] === undefined) return null
                            switch (key) {
                                case 'time':
                                    return (
                                        <TableCell
                                            size="medium"
                                            key={key}
                                            sx={{
                                                color: palette.textSecondary,
                                            }}
                                            style={{
                                                width: columnWidth + '%',
                                            }}
                                        >
                                            {getDatetimeObject(
                                                hour[key]!
                                            ).format('hh:00 A')}
                                        </TableCell>
                                    )
                                case 'visibility':
                                    return (
                                        <TableCell
                                            size="medium"
                                            key={key}
                                            sx={{
                                                width: columnWidth + '%',
                                                color: palette.textSecondary,
                                            }}
                                        >
                                            {(hour[key] + '').split('.')[0]}
                                        </TableCell>
                                    )
                                default:
                                    return (
                                        <TableCell
                                            size="medium"
                                            key={key}
                                            sx={{
                                                width: columnWidth + '%',
                                                color: palette.textSecondary,
                                            }}
                                        >
                                            {hour[key]}
                                        </TableCell>
                                    )
                            }
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
                    background: 'transparent',
                    borderBottom: `1px solid ${palette.textPrimary}`,
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minHeight: 0,
                        minWidth: 650,
                    }}
                    style={{
                        tableLayout: 'fixed',
                        borderCollapse: 'collapse',
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
                            overflow: 'hidden',
                        }}
                        style={{
                            borderCollapse: 'collapse',
                        }}
                    >
                        <TableContent keys={propKeys} />
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
