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
import { UserPreferencesKeysType, useUserPrefsStore } from '@/lib/stores'
import {
    HourTemperatureClass,
    HourTemperatureClassType,
} from '@/lib/obj/temperature'
import { PrecipitationClassType } from '@/lib/obj/precipitation'
import { WindClassType } from '@/lib/obj/wind'

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
    string?: string | (() => string)
    columnWidth: number
    palette: any
    prefsKey?: string
}

export interface GenericCellProps extends CellProps {
    prefsKey: undefined
    string?: string
}

export function GenericTableCell(props: GenericCellProps) {
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

export interface StateCellProps extends CellProps {
    string?: () => string
    prefsKey: UserPreferencesKeysType
}

export function GenericStateTableCell(props: StateCellProps) {
    const state = useUserPrefsStore((state) => state[props.prefsKey])
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
            {props.string ? props.string() : ''}
        </TableCell>
    )
}

interface StateTableCellProps {
    key: string
    obj: any
    columnWidth: number
    palette: any
}
interface TemperatureTableCellProps extends StateTableCellProps {
    obj: HourTemperatureClassType
}
export function TemperatureTableCell(props: TemperatureTableCellProps) {
    const state = useUserPrefsStore((state) => state.temperatureUnit)
    return (
        <TableCell
            size="medium"
            key={props.key}
            title={`Feels like: ${props.obj.getAppTempDisplayString()}`}
            sx={{
                color: props.palette.textSecondary,
                textAlign: 'center',
            }}
            style={{
                width: props.columnWidth + '%',
            }}
        >
            {props.obj.getTempDisplayString()}
        </TableCell>
    )
}

interface PrecipitationTableCellProps extends StateTableCellProps {
    obj: PrecipitationClassType
}

export function PrecipitationTableCell(props: PrecipitationTableCellProps) {
    const state = useUserPrefsStore((state) => state.precipitationUnit)
    return (
        <TableCell
            size="medium"
            key={props.key}
            title={`${props.obj.chance}% chance of ${props.obj.getUserValue}`}
            sx={{
                color: props.palette.textSecondary,
                textAlign: 'center',
            }}
            style={{
                width: props.columnWidth + '%',
            }}
        >
            {props.obj.getDisplayString()}
        </TableCell>
    )
}

export interface WindTableCellProps extends StateTableCellProps {
    obj: WindClassType
}

export function WindTableCell(props: WindTableCellProps) {
    const state = useUserPrefsStore((state) => state.windUnit)
    return (
        <TableCell
            size="medium"
            key={props.key}
            //title={props.obj.}
            title={
                'Wind speeds of ' +
                props.obj.getSpeed() +
                ' and gusts up to ' +
                props.obj.getGustSpeed() +
                ' ' +
                props.obj.getCardinalDirection()
            }
            sx={{
                color: props.palette.textSecondary,
                textAlign: 'center',
            }}
            style={{
                width: props.columnWidth + '%',
            }}
        >
            {props.obj.getDescription()}
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
            return PrecipitationTableCell({
                key: key,
                obj: precipObj,
                columnWidth: width,
                palette: palette,
            })
        case 'temperatureObj':
            const tempObj = hour.temperatureObj
            return TemperatureTableCell({
                key: key,
                obj: tempObj,
                columnWidth: width,
                palette: palette,
            })
        case 'windObj':
            return WindTableCell({
                key: key,
                obj: hour.windObj,
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
    const palette = useMuiTheme().palette

    const el = React.useRef<HTMLTableRowElement>(null)
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
        'windObj',
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
