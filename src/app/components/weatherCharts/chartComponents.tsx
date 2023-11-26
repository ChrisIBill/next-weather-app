import { CSSObject } from '@emotion/react'
import { ChevronRight, ChevronLeft } from '@mui/icons-material'
import {
    Drawer,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tabs,
    Tab,
    Button,
    Typography,
} from '@mui/material'
import React from 'react'
import {
    ChartDataKeys,
    ChartIconsMap,
    ChartKeysType,
    ChartTimespanType,
} from './weatherChart'
import { useTheme } from '@/lib/context'
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
    const theme = useTheme().theme
    const palette = paletteHandler(theme)

    return (
        <div className={styles.chartHeader}>
            <Tabs
                value={props.selectedTimespan}
                onChange={props.handleTimespanSelect}
                sx={{
                    color: 'black',
                }}
            >
                <Tab label="Day" value="Day" />
                <Tab label="Week" value="Week" />
            </Tabs>
            <div className={styles.chartButtonsWrapper}>
                {props.chartKeys.map((key) => (
                    <Button
                        key={key}
                        value={key}
                        variant="contained"
                        onClick={(e) => props.handleKeySelect(e, key)}
                        sx={{
                            backgroundColor: palette.primary,

                            marginRight: '0.5rem',
                        }}
                    >
                        {key === props.selectedKey ? (
                            <div
                                className={styles.chartButtonContent}
                                style={{}}
                            >
                                <div className={styles.iconWrapper}>
                                    <ChartKeyIcons chartKey={key} size={24} />
                                </div>
                                <Typography>{key}</Typography>
                            </div>
                        ) : (
                            <div
                                className={styles.chartButtonContent}
                                title={key}
                            >
                                <div className={styles.iconWrapper}>
                                    <ChartKeyIcons chartKey={key} size={24} />
                                </div>
                            </div>
                        )}
                    </Button>
                ))}
            </div>
        </div>
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
