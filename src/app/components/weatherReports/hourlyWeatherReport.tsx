import {
    DailyWeatherForecastObjectType,
    DailyWeatherForecastType,
    HourlyForecastObjectType,
} from '@/lib/interfaces'
import '../../_styles.scss'
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
import { useTheme as useMuiTheme } from '@mui/material/styles'
import paletteHandler from '@/lib/paletteHandler'
import { precipitationHandler } from '@/lib/weather'
import { WeatherCodesMap } from '@/lib/weathercodes'

interface StringMappedObject {
    [key: string]: string
}
const TableKeysToString: StringMappedObject = {
    timeObj: 'Time',
    temperatureObj: 'Temperature',
    precipitationObj: 'Precipitation',
    windObj: 'Wind',
    cloudObj: 'Cloud Cover',
}

export interface CellProps {
    key: string
    title?: string
    string?: string
    columnWidth: number
    palette: any
}

export function GenericTableCell(props: CellProps) {
    console.log('GenericTableCell props: ', props)
    return (
        <TableCell
            size="medium"
            key={props.key}
            title={props.title}
            sx={{
                color: props.palette.textSecondary,
                textAlign: 'center',
            }}
            style={{
                width: props.columnWidth + '%',
            }}
        >
            {props.string}
        </TableCell>
    )
}

export const bodyTableCellHandler = (
    key: string,
    hour: HourlyForecastObjectType,
    width: number,
    palette: any
) => {
    //TODO: Need a better key for these cells
    switch (key) {
        case 'timeObj':
            return GenericTableCell({
                key: key,
                title: 'Time',
                string: hour.timeObj.dateObj.format('hh:00 A'),
                columnWidth: width,
                palette: palette,
            })
        case 'precipitationObj':
            const precipObj = hour.precipitationObj
            return GenericTableCell({
                key: key,
                title: `${
                    precipObj.chance
                }% chance of ${precipObj.getUserValue()}`,
                string: precipObj.getDisplayString(),
                columnWidth: width,
                palette: palette,
            })
        case 'temperatureObj':
            const tempObj = hour.temperatureObj
            return GenericTableCell({
                key: key,
                title: `${tempObj.getAppTempDisplayString()}`,
                string: tempObj.getTempDisplayString(),
                columnWidth: width,
                palette: palette,
            })
        //case 'visibility':
        //    return GenericTableCell({
        //        key: key,
        //        string: (hour[key] + '').split('.')[0],
        //        columnWidth: width,
        //        palette: palette,
        //    })
        //case 'weathercode':
        //    const codeObj = WeatherCodesMap[hour[key]]
        //    return GenericTableCell({
        //        key: key,
        //        title: codeObj.long !== codeObj.short ? codeObj.long : '',
        //        string: codeObj.short,
        //        columnWidth: width,
        //        palette: palette,
        //    })
        case 'windspeed_10m':
            return GenericTableCell({
                key: key,
                string: (hour[key] + '').split('.')[0],
                columnWidth: width,
                palette: palette,
            })
        default:
            return GenericTableCell({
                key: 'undefinedCell',
                string: '',
                columnWidth: width,
                palette: palette,
            })
    }
}

export interface HourlyWeatherReportProps {
    //forecast?: DailyWeatherForecastType
    forecastObj?: HourlyForecastObjectType[]
    metadata?: any
    selectedHour?: number
    handleTimeSelect?: (day?: number, hour?: number) => void
}

export const HourlyWeatherReport: React.FC<HourlyWeatherReportProps> = (
    props: HourlyWeatherReportProps
) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    console.log('HourlyWeatherReport props: ', props)

    //const theme = useTheme()
    //const palette = paletteHandler(theme.theme)
    const palette = useMuiTheme().palette

    const el = React.useRef<HTMLTableRowElement>(null)
    //const hourlyForecast = props.forecast?.hourly_weather
    //    ? props.forecast.hourly_weather
    //    : []
    const hourlyForecast =
        typeof props.forecastObj !== 'undefined'
            ? props.forecastObj
            : new Array(24).fill(0).map((_, i) => {})
    const handleTimeSelect = props.handleTimeSelect
    //const defaultTime = props.forecast?.current_weather?.time
    //    ? dayjs(props.forecast.current_weather.time).hour()
    //    : 11
    const scrollToElement = (element: any) => {
        element.current.scrollIntoView(true)
    }

    const denseKeys = [
        'timeObj',
        'temperatureObj',
        'precipitationObj',
        //'windspeed_10m',
        //'weathercode',
    ]
    //TODO:
    //const propKeys = isExpanded ? Object.keys(hourlyForecast[0]) : denseKeys
    const propKeys = denseKeys

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
                }}
            >
                {props.keys.map((key) => {
                    const titleObj = TableKeysToString[key]
                    return (
                        <TableCell
                            key={key}
                            title={titleObj}
                            padding="checkbox"
                            size="small"
                            sx={{
                                background: palette.primary.main,
                                color: palette.primary.contrastText,
                                height: '1rem',
                                width: columnWidth + '%',
                                textAlign: 'center',
                            }}
                        >
                            {titleObj}
                        </TableCell>
                    )
                })}
            </TableRow>
        )
    }
    const TableContent: React.FC<TableProps> = (props: TableProps) => {
        //useEffect(() => {
        //    let firstRender = true
        //    if (firstRender && el.current) {
        //        console.log('scrolling to element: ', el.current)
        //        //TODO:
        //        //scrollToElement(el)
        //        firstRender = false
        //    }
        //}, [])
        useEffect(() => {
            console.log('Loading TableContent')
        }, [])
        return (
            <>
                {hourlyForecast.map((hour, index) => (
                    <tr
                        key={`weatherReportTR${index}`}
                        //ref={index === defaultTime ? el : null}
                        onClick={() => {
                            handleTimeSelect?.(undefined, index)
                        }}
                        style={{
                            color: palette.primary.contrastText,
                            backgroundColor: palette.secondary.main,
                        }}
                    >
                        {props.keys.map((key) => {
                            if (typeof hour?.[key] === 'undefined') return null
                            console.log('hour: ', hour)
                            return bodyTableCellHandler(
                                key,
                                hour,
                                columnWidth,
                                palette
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
                    background: 'transparent',
                    borderBottom: `1px solid ${palette.primary.contrastText}`,
                    scrollPaddingTop: '2rem',
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
                        <div
                            className="glowBox"
                            style={
                                {
                                    //set glowbox css vars
                                    '--height': '20rem',
                                    '--width': '100%',
                                } as React.CSSProperties
                            }
                        />
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
