import { useTheme, styled, Typography } from '@mui/material'
import React from 'react'
import {
    ChartDataKeys,
    ChartKeyToStateMap,
    ChartKeysType,
} from './weatherChart'
import { WiRaindrops, WiHumidity, WiThermometer } from 'react-icons/wi'
import { LuWind } from 'react-icons/lu'
import { UserPreferencesKeysType, useUserPrefsStore } from '@/lib/stores'
import { convertToUserTemp } from '@/lib/obj/temperature'
import { convertToUserWindSpeed } from '@/lib/obj/wind'
import logger from '@/lib/pinoLogger'
import { convertToUserUnit } from '@/lib/obj/forecastClass'
import _ from 'lodash'
import { Bar } from 'recharts'

export const ChartLogger = logger.child({ module: 'WeatherChart' })

export const ChartComponentLogger = ChartLogger.child({
    component: 'ChartComponent',
})

export interface ChartKeyButtonProps {
    chartKey: ChartDataKeys
    size?: number
}

export const ChartKeyIcons: React.FC<ChartKeyButtonProps> = (props) => {
    switch (props.chartKey) {
        case 'Temperature':
            return <WiThermometer size={props.size} />
        case 'Precipitation':
            return <WiRaindrops size={props.size} />
        case 'Humidity':
            return <WiHumidity size={props.size} />
        case 'Wind':
            return <LuWind size={props.size} />
    }
}

interface CustomizedYAxisTickProps {
    chartKey: string
    [key: string]: any
}

export const CustomizedYAxisTickGenerator: React.FC<
    CustomizedYAxisTickProps
> = (props: CustomizedYAxisTickProps) => {
    return (
        <text
            className={props.className}
            orientation="left"
            height={props.height}
            width={props.width}
            x={props.x}
            y={props.y}
            color={props.color}
            fill={props.fill}
            stroke={props.stroke}
            textAnchor={props.textAnchor}
        >
            <GenericYaxisStateTick {...props} />
        </text>
    )
}

export interface CustomizedYAxisTickTextProps {
    chartKey: ChartKeysType
    [key: string]: any
}

const GenericYaxisStateTick: React.FC<CustomizedYAxisTickProps> = (
    props: CustomizedYAxisTickProps
) => {
    const stateString = ChartKeyToStateMap[props.chartKey]
    const state = useUserPrefsStore(
        (state) => state[stateString as UserPreferencesKeysType]
    )

    const val = props.payload.value
    if (typeof val !== 'number' || typeof state === 'number') {
        ChartComponentLogger.error('val or state is not a number', {
            props,
            val,
            state,
            stateString,
        })
        return null
    }
    const userValue = convertToUserUnit(val, state)
    if (typeof userValue === 'undefined') {
        ChartComponentLogger.error('userValue is undefined', {
            props,
        })
        return null
    }
    const temperatureString = userValue + state

    return (
        <TickTextStyled x={props.x} dy={'0.355em'}>
            {temperatureString}
        </TickTextStyled>
    )
}

export const TickTextStyled = styled('tspan')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '0.9rem',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}))

const CustomizedTooltipLogger = ChartLogger.child({
    component: 'CustomizedTooltip',
})

export const CustomizedTooltip: React.FC<any> = (props: any) => {
    const palette = useTheme().palette
    const { payload, wrapperStyle, cursorStyle, labelStrings, ...styles } =
        props
    CustomizedTooltipLogger.debug('Rendering CustomizedTooltip', { props })

    return (
        <div
            className={'recharts-default-tooltip'}
            style={{
                margin: '0px',
                padding: '10px',
                backgroundColor: palette.background.paper,
                whiteSpace: 'nowrap',
                display: 'flex',
                flexDirection: 'column',
                border: `4px solid ${palette.divider}`,
            }}
        >
            <p
                className={'recharts-tooltip-label'}
                style={{
                    alignSelf: 'center',
                    color: palette.text.primary,
                }}
            >
                {props.label}
            </p>
            <ul
                style={{
                    listStyleType: 'none',
                }}
            >
                <TooltipTextGenerator {...props} />
            </ul>
        </div>
    )
}
const TooltipTextGenerator: React.FC<any> = (props: any) => {
    switch (props.chartKey) {
        case 'Temperature':
            return <TemperatureTooltipContent {...props} />
        case 'Precipitation':
            return <PrecipitationTooltipWrapper {...props} />
        case 'Wind':
            return <WindTooltipWrapper {...props} />
        default:
            return <GenericTooltipContent {...props} />
    }
}
const TemperatureTooltipContent: React.FC<any> = (props: any) => {
    const state = useUserPrefsStore((state) => state.temperatureUnit)
    const palette = useTheme().palette
    const { payload, label, active } = props
    const payloadVals = payload.map((entry: any) => entry.value[1])
    const rangeVals = payload.length > 0 ? payload[0].value : []
    const values =
        rangeVals.length > payloadVals.length ? rangeVals : payloadVals

    const labelStrings = props.labelStrings ?? ['', '']
    CustomizedTooltipLogger.debug('Rendering TemperatureTooltipContent', {
        props,
        labelStrings,
        payloadVals,
        rangeVals,
    })
    return (
        <GenericTooltipContent
            state={state}
            labelStrings={labelStrings}
            appendStrings={[` ${state}`, ` ${state}`]}
            {...props}
            values={values.map((val: any) => convertToUserTemp(val, state))}
        />
    )
}

const PrecipitationTooltipWrapper: React.FC<any> = (props: any) => {
    const state = useUserPrefsStore((state) => state.precipitationUnit)
    const values = props.payload.map((entry: any) => entry.value)
    if (values.length > 1) values[1] = convertToUserUnit(values[1], state)
    return (
        <GenericTooltipContent
            state={state}
            labelStrings={['', '']}
            appendStrings={['%', ` ${state}`]}
            values={values}
            {...props}
        />
    )
}

const WindTooltipWrapper: React.FC<any> = (props: any) => {
    const state = useUserPrefsStore((state) => state.windUnit)
    //need to add the first value to the second value to get the total gust speed
    const values =
        props.payload.length > 1
            ? [
                  props.payload[0].value,
                  props.payload[0].value + props.payload[1].value,
              ]
            : []
    CustomizedTooltipLogger.debug('Rendering WindTooltipWrapper', {
        props,
        values,
    })

    return (
        <GenericTooltipContent
            state={state}
            values={values.map((val: any) =>
                convertToUserWindSpeed(val, state)
            )}
            labelStrings={['Wind Speed: ', 'Gust Speed: ']}
            appendStrings={[` ${state}`, ` ${state}`]}
            {...props}
        />
    )
}

const GenericTooltipContent: React.FC<any> = (props: any) => {
    const prepend = typeof props.prepend === 'string' ? props.prepend : ''
    const palette = useTheme().palette
    const { payload, label, active } = props
    const values = props.values ?? payload.map((entry: any) => entry.value)
    const labelStrings = props.labelStrings ?? [
        payload?.[0]?.name + ':' ?? '',
        payload?.[1]?.name + ':' ?? '',
    ]
    CustomizedTooltipLogger.debug('GenericTooltipContent', {
        props,
        labelStrings,
        values,
    })

    const appendStrings = props.appendStrings ?? ['', '']
    return (
        <ul
            style={{
                listStyleType: 'none',
            }}
        >
            {values.map((value: any, index: number) => (
                <li
                    key={`item-${index}`}
                    style={{
                        ...payload[index],
                        color: palette.text.primary,
                    }}
                >
                    {labelStrings[index] + ' ' + value + appendStrings[index]}
                </li>
            ))}
        </ul>
    )
}

export interface RenderTogglerProps {
    children: React.ReactNode
    render: boolean
}

export const RenderToggler: React.FC<RenderTogglerProps> = (
    props: RenderTogglerProps
) => {
    if (props.render) {
        return <>{props.children}</>
    } else return null
}

export const CustomizedLegend: React.FC<any> = (props: any) => {
    ChartComponentLogger.debug('Rendering CustomizedLegend', { props })
    const palette = useTheme().palette
    const { payload, wrapperStyle, cursorStyle, labelStrings, ...styles } =
        props
    return (
        <div
            style={{
                width: '100%',
                height: '0',
            }}
        >
            <ul
                style={{
                    overflowY: 'hidden',
                    overflowX: 'auto',
                    position: 'absolute',
                    top: '-3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '0 0.5rem',
                    borderRadius: '16px',
                    listStyle: 'inside',
                }}
            >
                {payload.map((entry: any, index: number) =>
                    entry.type === 'none' ? null : (
                        <li
                            key={`item-${index}`}
                            style={{
                                whiteSpace: 'nowrap',
                                position: 'relative',
                                color: entry.color,
                            }}
                        >
                            <Typography
                                style={{
                                    color: palette.text.primary,
                                }}
                                variant="caption"
                                noWrap
                            >
                                {entry.value}
                            </Typography>
                        </li>
                    )
                )}
            </ul>
        </div>
    )
}
export const RenderShape = (props: any) => {
    const {
        height,
        width,
        fill,
        x,
        y,
        stopColor,
        startColor,
        gradientKey,
        index,
        background,
    } = props
    const y1Percent = _.clamp(y / background.height, 0, 1)
    const y2Percent = _.clamp((y + height) / background.height, 0, 1)
    ChartComponentLogger.debug('Rendering RenderShape', {
        props,
        index,
        y1Percent,
        y2Percent,
    })
    return (
        <svg
            x={x}
            y={'10px'}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                height: `${background.height}px`,
            }}
        >
            <defs>
                <linearGradient
                    id={gradientKey + index}
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor={stopColor} opacity="1" />
                    <stop offset="100%" stopColor={startColor} opacity="1" />
                </linearGradient>
                <clipPath id={`clip-${index}`}>
                    <rect y={y - background.y} width={width} height={height} />
                </clipPath>
            </defs>
            <rect
                id={`rect-${index}`}
                fill={`url(#${gradientKey + index})`}
                y={y - background.y}
                width={width}
                height={background.height}
                clipPath={`url(#clip-${index})`}
            />
        </svg>
    )
}
