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
                        color: palette.primary.contrastText,
                    }}
                />
                <Tab
                    label="Week"
                    value="Week"
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
        { icon: <WiHumidity size={size} />, name: 'Humidity' },
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
