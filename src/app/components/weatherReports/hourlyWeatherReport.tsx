import {
    DailyWeatherForecastObjectType,
    HourlyForecastObjectType,
} from '@/lib/interfaces'
import '../../_styles.scss'
import styles from './hourlyWeatherReport.module.scss'
import {
    ButtonBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'
import React from 'react'
import { useTheme } from '@mui/material/styles'
import { UserPreferencesKeysType, useUserPrefsStore } from '@/lib/stores'
import {
    HourTemperatureClass,
    HourTemperatureClassType,
} from '@/lib/obj/temperature'
import { PrecipitationClassType } from '@/lib/obj/precipitation'
import { WindClassType } from '@/lib/obj/wind'
import {
    useForecastSetStore,
    useSelectedForecastDay,
} from '@/lib/obj/forecastStore'
import { DEFAULT_HOUR_DATA } from '@/lib/obj/time'
import { CloudClassType } from '@/lib/obj/cloudClass'
import TouchRipple from '@mui/material/ButtonBase/TouchRipple'

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
    prefsKey?: undefined
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
                minWidth: props.columnWidth + '%',
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
    const titleString =
        'Feels Like: ' + props.obj.getAppTempDisplayStrings().join(' ')
    return (
        <TableCell
            size="medium"
            key={props.key}
            title={titleString}
            sx={{
                color: props.palette.textSecondary,
                textAlign: 'center',
            }}
            style={{
                width: props.columnWidth + '%',
            }}
        >
            {props.obj.getTempDisplayStrings()}
        </TableCell>
    )
}

interface PrecipitationTableCellProps extends StateTableCellProps {
    obj: PrecipitationClassType
}

export function PrecipitationTableCell(props: PrecipitationTableCellProps) {
    const state = useUserPrefsStore((state) => state.precipitationUnit)
    const displayString = props.obj.getDisplayString()
    return (
        <TableCell
            size="medium"
            key={props.key}
            title={`${props.obj.chance}% chance of ` + props.obj.getUserValue()}
            sx={{
                color: props.palette.textSecondary,
                textAlign: 'center',
            }}
            style={{
                width: props.columnWidth + '%',
            }}
        >
            {displayString === '' ? props.obj.chance + '%' : displayString}
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

export interface CloudTableCellProps extends StateTableCellProps {
    obj: CloudClassType
}

export function CloudTableCell(props: CloudTableCellProps) {
    return (
        <TableCell
            size="medium"
            key={props.key}
            title={props.obj.cloudCover + '% cloud cover'}
            sx={{
                color: props.palette.textSecondary,
                textAlign: 'center',
                pointerEvents: 'none',
            }}
            style={{
                width: props.columnWidth + '%',
            }}
        >
            {props.obj.getDisplayString()}
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
        case 'cloudObj':
            return CloudTableCell({
                key: key,
                obj: hour.cloudObj,
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
    forecastObj?: DailyWeatherForecastObjectType[]
}

export const HourlyWeatherReport: React.FC<HourlyWeatherReportProps> = (
    props: HourlyWeatherReportProps
) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const palette = useTheme().palette

    const el = React.useRef<HTMLTableRowElement>(null)
    const selectedForecastDay = useSelectedForecastDay(props.forecastObj)
    const hourlyForecast =
        typeof selectedForecastDay !== 'undefined'
            ? selectedForecastDay.hourly_weather
            : new Array(24).fill(0).map((_, i) => {})
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
        'cloudObj',
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
                hover
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
    const TableContent: React.FC<TableProps> = (props: any) => {
        console.log('TableContent: ', props)
        //useEffect(() => {
        //    let firstRender = true
        //    if (firstRender && el.current) {
        //        console.log('scrolling to element: ', el.current)
        //        //TODO:
        //        //scrollToElement(el)
        //        firstRender = false
        //    }
        //}, [])
        return hourlyForecast.map((hour, index) => (
            <TableContentRow
                key={`weatherReportTR${index}`}
                index={index}
                forecastObj={hour ?? undefined}
                columnWidth={columnWidth}
                keys={props.keys}
            />
        ))
    }

    return (
        <div className={styles.wrapper}>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: '0.5rem',
                    margin: '1rem',
                    width: '900px',
                    background: 'transparent',
                    boxShadow: '3px 6px 10px rgba(0, 0, 0, 0.9)',
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minHeight: 0,
                        minWidth: 450,
                    }}
                    style={{
                        //tableLayout: 'fixed',
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

export interface TableContentRowProps {
    index: number
    forecastObj?: HourlyForecastObjectType
    columnWidth: number
    keys: string[]
}

export const dataRowSX = {
    display: 'table-row',
    ':hover': {
        backgroundColor: 'red',
        cursor: 'pointer',
    },
}

const TableContentRow: React.FC<TableContentRowProps> = (
    props: TableContentRowProps,
    ...otherProps
) => {
    const rippleRef = React.useRef<any>(null)
    const onRippleStart = (e: any) => {
        rippleRef.current?.start?.(e)
    }
    const onRippleStop = (e: any) => {
        rippleRef.current?.stop?.(e)
    }
    const palette = useTheme().palette
    const setForecastStoreState = useForecastSetStore()
    const timeObj = props.forecastObj?.timeObj
    const handleTableSelect = () => {
        setForecastStoreState.setHour(props.index)
        setForecastStoreState.setTemperatureMagnitude(
            props.forecastObj?.temperatureObj.getMagnitude() ?? 0
        )
        setForecastStoreState.setCloudMagnitude(
            props.forecastObj?.cloudObj.cloudCover ?? 0
        )
        setForecastStoreState.setCloudLightness(
            props.forecastObj?.cloudObj.getCloudLightness() ?? 99
        )
        setForecastStoreState.setRainMagnitude(
            props.forecastObj?.precipitationObj.getMagnitude() ?? 0
        )
        //setForecastStoreState.setSnowMagnitude(props.forecastObj?.precipitationObj.getAvgSnow())
        setForecastStoreState.setWindMagnitude(
            props.forecastObj?.windObj._beaufort()[0] ?? 0
        )
        setForecastStoreState.setTimePercent(timeObj?.getTimePercent() ?? 0.5)
        setForecastStoreState.setTimeOfDay(
            timeObj?.getTimeOfDay ?? palette.mode === 'dark' ? 'night' : 'day'
        )
        setForecastStoreState.setIsDay(
            timeObj?.getIsDay() ?? palette.mode === 'dark' ? false : true
        )
    }

    return (
        <TableRow
            //component={TableRow}
            //sx={dataRowSX}
            {...otherProps}
            hover={true}
            //ref={index === defaultTime ? el : null}
            onClick={() => {
                handleTableSelect()
            }}
            onMouseDown={onRippleStart}
            onMouseUp={onRippleStop}
            sx={{
                display: 'table-row',
                width: '100%',
                position: 'relative',

                '&:hover td:nth-of-type(n)': {
                    background: palette.secondary.dark,
                },
                '&:not(:hover) td:nth-of-type(n)': {
                    background: palette.secondary.main,
                },
            }}
            style={
                {
                    color: palette.primary.contrastText,
                    //backgroundColor: palette.secondary.main,
                    backgroundColor:
                        palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : '',
                } as React.CSSProperties
            }
        >
            {props.keys.map((key) => {
                if (typeof props.forecastObj?.[key] === 'undefined') return null
                return bodyTableCellHandler(
                    key,
                    props.forecastObj,
                    props.columnWidth,
                    palette
                )
            })}
            <TouchRipple
                ref={rippleRef}
                center={false}
                style={{
                    position: 'absolute',
                }}
            />
        </TableRow>
    )
}
