import {
    Tabs,
    Tab,
    Button,
    Typography,
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
    Box,
    useTheme,
} from '@mui/material'
import React from 'react'
import { ChartDataKeys, ChartKeysType, ChartTimespanType } from './weatherChart'
import styles from './weatherChart.module.scss'
import { WiRaindrops, WiHumidity, WiThermometer } from 'react-icons/wi'
import { LuWind } from 'react-icons/lu'
import paletteHandler from '@/lib/paletteHandler'
import { useUserPrefsStore } from '@/lib/stores'
import { convertToUserTemp } from '@/lib/obj/temperature'

export interface WeatherChartControlsProps {
    selectedKey: ChartKeysType
    selectedTimespan: ChartTimespanType
    chartWidth?: number
    chartKeys: ChartKeysType[]
    handleKeySelect: (e: any, val: any) => void
    handleTimespanSelect: (e: any, timespan: ChartTimespanType) => void
}

export const WeatherChartHeader: React.FC<WeatherChartControlsProps> = (
    props
) => {
    const palette = useTheme().palette

    return (
        <div className={styles.chartHeader} style={{}}>
            <Tabs
                value={props.selectedTimespan}
                onChange={props.handleTimespanSelect}
                sx={{
                    minHeight: '56px',
                    zIndex: 2000,
                }}
            >
                <Tab
                    label="Day"
                    value="Day"
                    className={styles.chartHeaderTab}
                    sx={{
                        borderRadius: '16px',
                        marginRight: '8px',
                        marginLeft: '8px',
                        marginBottom: '8px',
                    }}
                    style={{
                        backgroundColor:
                            props.selectedTimespan === 'Day'
                                ? palette.primary.dark
                                : palette.primary.main,
                        boxShadow:
                            props.selectedTimespan === 'Day' ? 'none' : '',
                        color: palette.primary.contrastText,
                    }}
                />
                <Tab
                    label="Week"
                    value="Week"
                    className={styles.chartHeaderTab}
                    sx={{
                        borderRadius: '16px',
                        marginRight: '8px',
                        marginLeft: '8px',
                        marginBottom: '8px',
                    }}
                    style={{
                        backgroundColor:
                            props.selectedTimespan === 'Week'
                                ? palette.primary.dark
                                : palette.primary.main,
                        boxShadow:
                            props.selectedTimespan === 'Week' ? 'none' : '',

                        color: palette.primary.contrastText,
                    }}
                />
            </Tabs>
            <WeatherChartDial
                handleDialSelect={props.handleKeySelect}
                chartKey={props.selectedKey}
            />
        </div>
    )
}

export interface ChartDialActionsProps {
    size?: number
}
const ChartDialActionsMap = ({ size = 24 }: ChartDialActionsProps) => {
    return [
        { icon: <WiThermometer size={size} />, name: 'Temperature' },
        { icon: <WiRaindrops size={size} />, name: 'Precipitation' },
        //{ icon: <WiHumidity size={size} />, name: 'Humidity' },
        { icon: <LuWind size={size} />, name: 'Wind' },
    ]
}

export interface WeatherChartDialProps {
    handleDialSelect: (e: any, val: any) => void
    chartKey: ChartKeysType
}

export const WeatherChartDial: React.FC<WeatherChartDialProps> = (props) => {
    /*TODO:
     * Need to handle position of dial so it doesn't
     * overlap vital parts of chart
     */
    return (
        <Box
            sx={{
                width: 320,
                transform: 'translateZ(0px)',
                flexGrow: 1,
                zIndex: 2000,
            }}
        >
            <SpeedDial
                ariaLabel={'ChartDial'}
                direction={'left'}
                sx={{}}
                icon={ChartKeyIcons({ chartKey: props.chartKey, size: 24 })}
            >
                {ChartDialActionsMap({ size: 24 }).map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        onClick={(e) => props.handleDialSelect(e, action.name)}
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
        </Box>
    )
}

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
            <TickTextGenerator {...props} />
        </text>
    )
}
const TickTextGenerator: React.FC<any> = (props: any) => {
    switch (props.chartKey) {
        case 'Temperature':
            return <CustomizedYAxisTemperatureTick {...props} />
        case 'Precipitation':
            return <CustomizedYAxisPrecipitationTick {...props} />
        default:
            return <CustomizedYAxisTemperatureTick {...props} />
    }
}
const CustomizedYAxisTemperatureTick: React.FC<any> = (props: any) => {
    const palette = useTheme().palette
    const tempUnit = useUserPrefsStore((state) => state.temperatureUnit)
    const temperatureString =
        convertToUserTemp(props.payload.value, tempUnit).toFixed(0) + tempUnit
    return (
        <tspan x={props.x} dy={'0.355em'}>
            {temperatureString}
        </tspan>
    )
}
const CustomizedYAxisPrecipitationTick: React.FC<any> = (props: any) => {
    //const precipUnit = useUserPrefsStore((state) => state.precipitationUnit)
    const precipitationString = props.payload.value + '%'
    return (
        <tspan x={props.x} dy={'0.355em'}>
            {precipitationString}
        </tspan>
    )
}
export const CustomizedTooltip: React.FC<any> = (props: any) => {
    const palette = useTheme().palette
    const { payload, wrapperStyle, cursorStyle, labelStyle, ...styles } = props
    return (
        <div
            className={'recharts-default-tooltip'}
            style={{
                margin: '0px',
                padding: '10px',
                backgroundColor: palette.background.paper,
                whiteSpace: 'nowrap',
            }}
        >
            <p className={'recharts-tooltip-label'} style={{}}></p>
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
            return <GenericTooltipContent append={'%'} {...props} />
        default:
            return <GenericTooltipContent {...props} />
    }
}
const TemperatureTooltipContent: React.FC<any> = (props: any) => {
    const tempUnit = useUserPrefsStore((state) => state.temperatureUnit)
    const palette = useTheme().palette
    const { payload, label, active } = props
    return (
        <ul
            style={{
                listStyleType: 'none',
            }}
        >
            {payload.map((entry: any, index: number) => (
                <li
                    key={`item-${index}`}
                    style={{
                        ...entry,
                        color: palette.text.primary,
                    }}
                >
                    {(index == 1 ? 'Feels Like: ' : '') +
                        convertToUserTemp(entry.value, tempUnit).toFixed(0) +
                        tempUnit}
                </li>
            ))}
        </ul>
    )
}

const GenericTooltipContent: React.FC<any> = (props: any) => {
    const prepend = typeof props.prepend === 'string' ? props.prepend : ''
    const append = typeof props.append === 'string' ? props.append : ''
    const palette = useTheme().palette
    const { payload, label, active } = props
    return (
        <ul
            style={{
                listStyleType: 'none',
            }}
        >
            {payload.map((entry: any, index: number) => (
                <li
                    key={`item-${index}`}
                    style={{
                        ...entry,
                        color: palette.text.primary,
                    }}
                >
                    {prepend + entry.value + append}
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
