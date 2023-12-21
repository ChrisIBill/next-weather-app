import {
    DailyWeatherForecastObjectType,
    ForecastObjectType,
} from '@/lib/interfaces'
import { Typography, useTheme, styled } from '@mui/material'
import styles from './selectedForecastReadout.module.scss'
import { useBackgroundColors } from '../background/dayNightColorLayer'
import { TimeClassType, getTimeClassType } from '@/lib/obj/time'
import {
    TemperatureClassType,
    TemperatureComponentWrapper,
} from '@/lib/obj/temperature'
import {
    PrecipitationClassType,
    PrecipitationComponentWrapper,
} from '@/lib/obj/precipitation'
import { useSelectedForecastTime } from '@/lib/obj/forecastStore'
import { useEffect, useState } from 'react'
import { WindClassType, WindComponentWrapper } from '@/lib/obj/wind'
import { CloudClassType } from '@/lib/obj/cloudClass'

export interface SelectedForecastReadoutProps {
    forecastObj?: DailyWeatherForecastObjectType[]
}

const ReadoutWrapper = styled('div')(({ theme }) => ({}))

export const SelectedForecastReadout: React.FC<SelectedForecastReadoutProps> = (
    props: SelectedForecastReadoutProps
) => {
    const [mounted, setMounted] = useState<boolean>(false)
    const selectedForecast = useSelectedForecastTime(props.forecastObj)

    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) {
        return <div className={styles.headerWrapper}></div>
    }
    return props.forecastObj ? (
        <ReadoutWrapper className={styles.readoutWrapper}>
            <InfoReadout forecastObj={selectedForecast} />
            <TimeReadout timeObj={selectedForecast?.timeObj} />
            <div className={styles.spacerElement} />
        </ReadoutWrapper>
    ) : (
        <div className={styles.readoutWrapper}>Loading Selected Forecast</div>
    )
}

const DateTimeTypography = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        fontSize: '3rem',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '2.5rem',
    },
}))
const HourTypography = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        fontSize: '2rem',
    },
}))

export interface WeatherPageHeaderProps {
    timeObj?: TimeClassType
}
const TimeReadout: React.FC<WeatherPageHeaderProps> = (
    props: WeatherPageHeaderProps
) => {
    const [mounted, setMounted] = useState<boolean>(false)
    const palette = useTheme().palette

    const timeObj = props.timeObj
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted || !timeObj) {
        return <div className={styles.headerWrapper}></div>
    }
    return (
        <div
            className={styles.datetimeWrapper}
            data-theme={palette.mode}
            style={{
                color: palette.text.primary,
            }}
        >
            <div>
                <DateTimeTypography
                    align="center"
                    noWrap
                    className={styles.headerText}
                    sx={{
                        fontSize: '3.5rem',
                        fontWeight: 'lighter',
                    }}
                    style={{}}
                >
                    {timeObj.dateObj.format('dddd')}
                </DateTimeTypography>
                <DateTimeTypography
                    variant="h2"
                    align="center"
                    noWrap={true}
                    className={styles.headerText}
                    sx={{
                        fontSize: '3.5rem',
                        fontWeight: 'lighter',
                    }}
                    style={{}}
                >
                    {timeObj.dateObj.format('MMMM D')}
                </DateTimeTypography>
            </div>
            <HourTypography
                variant="h3"
                className={styles.headerText}
                sx={{
                    fontSize: '2.5rem',
                    fontWeight: 'lighter',
                }}
            >
                {getTimeClassType(timeObj) === 'hour'
                    ? timeObj.dateObj.format('h:mm A')
                    : ''}
            </HourTypography>
        </div>
    )
}

interface WeatherReportProps {
    forecastObj?: ForecastObjectType
}

const InfoReadout: React.FC<WeatherReportProps> = (
    props: WeatherReportProps
) => {
    //const precipUnits = useUserPrefsStore((state) => state.precipitationUnit)
    //const precipObj = props.forecastObj?.precipitationObj

    const theme = useTheme()
    const palette = theme.palette

    return (
        <div
            className={styles.infoWrapper}
            style={{
                color: palette.text.primary,
            }}
        >
            <PrecipitationComponentWrapper>
                <PrecipitationReadout
                    precipitationObj={props.forecastObj?.precipitationObj}
                />
            </PrecipitationComponentWrapper>
            <CloudReadout cloudObj={props.forecastObj?.cloudObj} />
            <WindComponentWrapper>
                <WindReadout windObj={props.forecastObj?.windObj} />
            </WindComponentWrapper>
            <TemperatureComponentWrapper>
                <TemperatureReadout
                    temperatureObj={props.forecastObj?.temperatureObj}
                />
            </TemperatureComponentWrapper>
        </div>
    )
}

const ReadoutTypography = styled(Typography)(({ theme }) => ({}))

interface ReadoutProps {
    temperatureObj?: TemperatureClassType
    precipitationObj?: PrecipitationClassType
    windObj?: WindClassType
    cloudObj?: CloudClassType
}

const TemperatureReadout: React.FC<ReadoutProps> = (props: ReadoutProps) => {
    return (
        <ReadoutTypography variant="body1">
            {props.temperatureObj?.getTempDisplayStrings()}
        </ReadoutTypography>
    )
}

const PrecipitationReadout: React.FC<ReadoutProps> = (props: ReadoutProps) => {
    return (
        <ReadoutTypography variant="body1">
            {props.precipitationObj?.getDisplayString()}
        </ReadoutTypography>
    )
}

const WindReadout: React.FC<ReadoutProps> = (props: ReadoutProps) => {
    return (
        <ReadoutTypography variant="body1">
            {props.windObj?.getDescription()}
        </ReadoutTypography>
    )
}

const CloudReadout: React.FC<ReadoutProps> = (
    props: ReadoutProps
): JSX.Element => {
    return (
        <ReadoutTypography variant="body1">
            {props.cloudObj?.getDisplayString()}
        </ReadoutTypography>
    )
}
