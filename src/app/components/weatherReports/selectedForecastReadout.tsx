import {
    CurrentWeatherDataType,
    DailyWeatherForecastType,
    DetailedWeatherDataType,
    ForecastObjectType,
} from '@/lib/interfaces'
import { Typography, useTheme } from '@mui/material'
import styles from './selectedForecastReadout.module.scss'
import { useBackgroundColors } from '../background/dayNightColorLayer'
import { TimeObjectType } from '@/lib/time'
import {
    DayTimeClassType,
    HourTimeClassType,
    TimeClassType,
    getTimeClassType,
} from '@/lib/obj/time'
import { useUserPrefsStore } from '@/lib/stores'
import {
    TemperatureClassType,
    TemperatureComponentWrapper,
} from '@/lib/obj/temperature'
import {
    PrecipitationClassType,
    PrecipitationComponentWrapper,
} from '@/lib/obj/precipitation'

export interface WeatherPageHeaderProps {
    backgroundColor: string
    timeObj?: TimeClassType
}
const TimeReadout: React.FC<WeatherPageHeaderProps> = (
    props: WeatherPageHeaderProps
) => {
    const palette = useTheme().palette

    const timeObj = props.timeObj
    const backgroundColor = props.backgroundColor
    return timeObj ? (
        <div
            className={styles.datetimeWrapper}
            data-theme={palette.mode}
            style={{
                color: palette.getContrastText(backgroundColor),
            }}
        >
            <Typography
                variant="h2"
                component="h2"
                className={styles.headerText}
                sx={{
                    fontWeight: 'lighter',
                }}
                style={{
                    color: palette.getContrastText(backgroundColor),
                }}
            >
                {timeObj.dateObj.format('dddd')}
            </Typography>
            <Typography
                variant="h3"
                component="h3"
                className={styles.headerText}
                sx={{
                    fontWeight: 'lighter',
                }}
            >
                {timeObj.dateObj.format('MMMM D')}
            </Typography>
            <Typography
                variant="h4"
                component="h4"
                className={styles.headerText}
                sx={{
                    fontWeight: 'lighter',
                }}
            >
                {getTimeClassType(timeObj) === 'hour'
                    ? timeObj.dateObj.format('h:mm A')
                    : ''}
            </Typography>
        </div>
    ) : (
        <div className={styles.headerWrapper}>Loading Weather Page Header</div>
    )
}

interface WeatherReportProps {
    forecastObj?: ForecastObjectType
    background: string
}

const InfoReadout: React.FC<WeatherReportProps> = (
    props: WeatherReportProps
) => {
    console.log('InfoReadout props: ', props)
    //const precipUnits = useUserPrefsStore((state) => state.precipitationUnit)
    //const precipObj = props.forecastObj?.precipitationObj

    const theme = useTheme()
    const palette = theme.palette

    return (
        <div
            className={styles.infoWrapper}
            style={{
                color: palette.getContrastText(props.background),
            }}
        >
            {/* <Typography variant="body1" gutterBottom> */}
            {/*     Temperature: {forecastObj?.temperature_2m} */}
            {/* </Typography> */}
            {/* <Typography variant="body1" gutterBottom> */}
            {/*     Wind speed: {forecast?.windspeed_10m} */}
            {/* </Typography> */}
            {/* <Typography variant="body1" gutterBottom> */}
            {/*     Cloud Cover: {forecast?.cloudcover} */}
            {/* </Typography> */}
            {/* <TemperatureReadout */}
            {/*     temperatureObj={props.forecastObj?.temperatureObj} */}
            {/* /> */}
            <TemperatureComponentWrapper>
                <TemperatureReadout
                    temperatureObj={props.forecastObj?.temperatureObj}
                />
            </TemperatureComponentWrapper>
            <PrecipitationComponentWrapper>
                <PrecipitationReadout
                    precipitationObj={props.forecastObj?.precipitationObj}
                />
            </PrecipitationComponentWrapper>
        </div>
    )
}

interface ReadoutProps {
    temperatureObj?: TemperatureClassType
    precipitationObj?: PrecipitationClassType
}

const TemperatureReadout: React.FC<ReadoutProps> = (props: ReadoutProps) => {
    return (
        <Typography variant="body1" gutterBottom>
            {props.temperatureObj?.getTempDisplayString()}
        </Typography>
    )
}

const PrecipitationReadout: React.FC<ReadoutProps> = (props: ReadoutProps) => {
    return (
        <Typography variant="body1" gutterBottom>
            {props.precipitationObj?.getDisplayString()}
        </Typography>
    )
}

export interface SelectedForecastReadoutProps {
    forecastObj?: ForecastObjectType
}

export const SelectedForecastReadout: React.FC<SelectedForecastReadoutProps> = (
    props: SelectedForecastReadoutProps
) => {
    const palette = useTheme().palette
    const timeObj = props.forecastObj?.timeObj
    const backgroundColor =
        useBackgroundColors()[
            timeObj?.getTimeOfDay
                ? timeObj.getTimeOfDay()
                : palette.mode === 'light'
                ? 'day'
                : 'night'
        ].sky
    return props.forecastObj ? (
        <div className={styles.readoutWrapper}>
            <InfoReadout
                forecastObj={props.forecastObj}
                background={backgroundColor}
            />
            <TimeReadout
                timeObj={props.forecastObj?.timeObj}
                backgroundColor={backgroundColor}
            />
            <div className={styles.spacerElement} />
        </div>
    ) : (
        <div className={styles.readoutWrapper}>Loading Selected Forecast</div>
    )
}
