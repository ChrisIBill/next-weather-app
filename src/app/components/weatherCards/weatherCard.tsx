import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import styles from './weatherCards.module.scss'
import {
    DailyWeatherForecastObjectType,
    DailyWeatherForecastType,
} from '@/lib/interfaces'
import { WeatherCodesMap } from '@/lib/weathercodes'
import ErrorBoundary from '@/lib/errorBoundary'
import { useTheme } from '@mui/material/styles'
import { Background } from '../background/background'
import { DayTimeClassType } from '@/lib/obj/time'
import {
    TemperatureClassType,
    TemperatureComponentWrapper,
} from '@/lib/obj/temperature'
import { PrecipitationClassType } from '@/lib/obj/precipitation'
import {
    useForecastSetStore,
    useForecastObjStore,
    useUserPrefsStore,
} from '@/lib/stores'

export interface WeatherCardProps {
    weather: DailyWeatherForecastType
    forecastObj: DailyWeatherForecastObjectType
    handleCardSelect: (day: number) => void
    index: number
    selectedDay?: number
}
export const WeatherCard: React.FC<WeatherCardProps> = (
    props: WeatherCardProps
) => {
    const setCloudCover = useForecastObjStore(
        (state) => state.cloudMagnitude.setState
    )
    const weather = props.weather
    const palette = useTheme().palette

    const setForecastStoreState = useForecastSetStore()

    const handleCardSelect = (day: number) => {
        props.handleCardSelect(day)
        setForecastStoreState.setTime([props.index])
        setForecastStoreState.setTemperatureMagnitude(
            props.forecastObj?.temperatureObj.getAvgTemp()
        )
        setForecastStoreState.setCloudMagnitude(
            props.forecastObj?.cloudObj.cloudCover
        )
        setForecastStoreState.setCloudLightness(
            props.forecastObj?.cloudObj.getCloudLightness()
        )
        setForecastStoreState.setRainMagnitude(
            props.forecastObj?.precipitationObj.getMagnitude()
        )
        //setForecastStoreState.setSnowMagnitude(props.forecastObj?.precipitationObj.getAvgSnow())
        setForecastStoreState.setWindMagnitude(
            props.forecastObj?.windObj._beaufort()[0]
        )
        setForecastStoreState.setTimePercent(0.5)
        setForecastStoreState.setTimeOfDay(
            palette.mode === 'dark' ? 'night' : 'day'
        )
        setForecastStoreState.setIsDay(palette.mode === 'dark' ? false : true)
    }

    const newTimeObj = props.forecastObj.timeObj
    return (
        <Card
            className={styles.weatherCard}
            variant="elevation"
            sx={{
                position: 'relative',
                backgroundColor: `${palette.primary.main}`,
                color: `${palette.primary.contrastText}`,
                borderRadius: '16px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
        >
            <CardActionArea
                className={styles.actionArea}
                onClick={(event) => handleCardSelect(props.index)}
                disabled={props.index == props.selectedDay}
                sx={{
                    backgroundColor:
                        palette.mode === 'dark'
                            ? `rgba(0, 0, 0, 0.35)`
                            : `rgba(0,0,0, 0.0)`,
                }}
            >
                <CardContent
                    style={{
                        padding: '0',
                    }}
                >
                    <div className={styles.contentWrapper}>
                        <ErrorBoundary
                            fallback={
                                <div className={styles.headerWrapper}>
                                    <Typography variant="h5">
                                        Error with date element
                                    </Typography>
                                </div>
                            }
                        >
                            <WeatherCardHeader
                                date={weather.time!}
                                forecastObj={props.forecastObj}
                                timeObj={newTimeObj}
                                index={props.index}
                            />
                        </ErrorBoundary>
                        <br />
                        <WeatherCardContent
                            weather={weather}
                            forecastObj={props.forecastObj}
                        />
                    </div>
                </CardContent>
            </CardActionArea>
            <Background forecastObj={props.forecastObj} isCard={true} />
        </Card>
    )
}

export interface CardHeaderProps {
    date: string
    forecastObj?: DailyWeatherForecastObjectType
    timeObj: DayTimeClassType
    index: number
}

const WeatherCardHeader = (props: CardHeaderProps) => {
    const date = props.timeObj.dateObj
    const weekdayString = () => {
        switch (props.index) {
            case 0:
                return 'Today'
            case 1:
                return 'Tomorrow'
            default:
                return date.format('ddd')
        }
    }
    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
            }}
        >
            <div className={styles.headerWrapper} style={{}}>
                <Typography
                    variant="h5"
                    align="left"
                    style={{
                        alignSelf: 'flex-start',
                    }}
                >
                    {date.format('ddd')}
                </Typography>
                <Typography
                    variant="h6"
                    align="left"
                    style={{
                        alignSelf: 'flex-start',
                    }}
                >
                    {date.format('MMM D')}
                </Typography>
            </div>
            <TemperatureReadout
                temperatureObj={props.forecastObj?.temperatureObj}
            />
        </div>
    )
}

export const CardContentKeys = [
    'weathercode',
    'temperature_2m_min',
    'temperature_2m_max',
]

export interface CardContentProps {
    forecastObj: DailyWeatherForecastObjectType
    weather: DailyWeatherForecastType
}
const WeatherCardContent: React.FC<CardContentProps> = ({
    forecastObj,
    weather,
}: CardContentProps) => {
    for (const key of CardContentKeys) {
        if (weather[key] === undefined) {
            weather[key] = 'N/A'
        }
    }
    //const precipType = weather.rain_sum ?
    return (
        <div className={styles.bodyWrapper} style={{}}>
            <Typography variant="body1">
                {forecastObj.cloudObj.getDisplayString()}
            </Typography>
            <Typography variant="body1">
                {forecastObj.windObj.getDescription()}
            </Typography>
            <Typography variant="body1">
                {forecastObj.precipitationObj.getDisplayString()}
            </Typography>
        </div>
    )
}

interface ReadoutProps {
    temperatureObj?: TemperatureClassType
    precipitationObj?: PrecipitationClassType
}

const TemperatureReadout: React.FC<ReadoutProps> = (props: ReadoutProps) => {
    const tempUnit = useUserPrefsStore((state) => state.temperatureUnit)
    const temperatureStrings = props.temperatureObj
        ?.getTempDisplayString()
        .split('/') ?? ['', '']
    return (
        <div>
            <Typography variant="body1" gutterBottom>
                {temperatureStrings[0]}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {temperatureStrings[1]}
            </Typography>
        </div>
    )
}
