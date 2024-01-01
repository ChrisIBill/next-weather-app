import {
    Box,
    SpeedDial,
    SpeedDialAction,
    Tab,
    Tabs,
    styled,
    useTheme,
} from '@mui/material'
import { ChartKeysType, ChartTimespanType } from './weatherChart'
import styles from './weatherChart.module.scss'
import { WiRaindrops, WiThermometer } from 'react-icons/wi'
import { LuWind } from 'react-icons/lu'
import { ChartKeyIcons } from './chartComponents'

export interface WeatherChartControlsProps {
    selectedKey: ChartKeysType
    selectedTimespan: ChartTimespanType
    chartWidth?: number
    chartKeys: ChartKeysType[]
    handleKeySelect: (e: any, val: any) => void
    handleTimespanSelect: (e: any, timespan: ChartTimespanType) => void
}

const ChartHeaderStyles = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        paddingLeft: '0px',
    },
    [theme.breakpoints.up('sm')]: {
        paddingLeft: '60px',
    },
}))

const ChartHeaderTab = styled(Tab)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        minWidth: '80px',
        padding: '10px 14px',
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: '60px',
        padding: '4px 6px',
    },
}))

const WeatherChartHeader: React.FC<WeatherChartControlsProps> = (props) => {
    const palette = useTheme().palette

    return (
        <ChartHeaderStyles
            className={styles.chartHeader}
            style={{
                position: 'relative',
                width: '100%',
                top: '4px',
                zIndex: 2000,
            }}
        >
            <Tabs
                value={props.selectedTimespan}
                onChange={props.handleTimespanSelect}
                sx={{
                    minHeight: '56px',
                    zIndex: 2000,
                }}
            >
                <ChartHeaderTab
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
                <ChartHeaderTab
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
        </ChartHeaderStyles>
    )
}

interface ChartDialActionsProps {
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

interface WeatherChartDialProps {
    handleDialSelect: (e: any, val: any) => void
    chartKey: ChartKeysType
}

const WeatherChartDial: React.FC<WeatherChartDialProps> = (props) => {
    /*TODO:
     * Need to handle position of dial so it doesn't
     * overlap vital parts of chart
     */
    return (
        <Box
            sx={{
                position: 'absolute',
                right: '0',
                height: 320,
                transform: 'translateZ(0px)',
                flexGrow: 1,
                zIndex: 2000,
            }}
        >
            <SpeedDial
                ariaLabel={'ChartDial'}
                direction={'down'}
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

export default WeatherChartHeader
