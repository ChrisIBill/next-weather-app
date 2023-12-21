import {
    Card,
    CardActionArea,
    CardContent,
    Divider,
    Typography,
    styled,
} from '@mui/material'
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
import { useUserPrefsStore } from '@/lib/stores'
import {
    useForecastObjStore,
    useForecastSetStore,
} from '@/lib/obj/forecastStore'

export interface WeatherCardProps {
    forecastObj: DailyWeatherForecastObjectType
    index: number
}
export const WeatherCard: React.FC<WeatherCardProps> = (
    props: WeatherCardProps
) => {
    const palette = useTheme().palette

    const setForecastStoreState = useForecastSetStore()

    const handleCardSelect = (day: number) => {
        setForecastStoreState.setTime([props.index, undefined])
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
            //variant="elevation"
            sx={{
                position: 'absolute',
                width: '200%',
                paddingBottom: '250%',
                //top: '0px',
                //left: '0px',
                //bottom: '0px',
                //right: '0px',
                backgroundColor: `${palette.primary.main}`,
                color: `${palette.primary.contrastText}`,
                borderRadius: '16px',
                boxShadow: '3px 6px 10px rgba(0, 0, 0, 0.9)',
            }}
        >
            <CardActionArea
                className={styles.actionArea}
                onClick={(event) => handleCardSelect(props.index)}
                //disabled={props.index == props.selectedDay}
                sx={{
                    position: 'absolute',
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
                                forecastObj={props.forecastObj}
                                timeObj={newTimeObj}
                                index={props.index}
                            />
                        </ErrorBoundary>
                        <br />
                        <WeatherCardContent forecastObj={props.forecastObj} />
                    </div>
                </CardContent>
            </CardActionArea>
            <Background forecastObj={props.forecastObj} isCard={true} />
        </Card>
    )
}

const HeaderWrapper = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        div: {
            flexDirection: 'column',
        },
    },
}))

export interface CardHeaderProps {
    forecastObj?: DailyWeatherForecastObjectType
    timeObj: DayTimeClassType
    index: number
}

const WeatherCardHeader = (props: CardHeaderProps) => {
    const date = props.timeObj.dateObj
    const theme = useTheme()
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
        <HeaderWrapper
            style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                //flexDirection: 'column',
            }}
        >
            <div className={styles.headerWrapper} style={{}}>
                <Typography
                    variant="h5"
                    //align="left"
                    style={{
                        alignSelf: 'flex-start',
                    }}
                >
                    {date.format('ddd')}
                </Typography>
                <Typography
                    variant="h6"
                    //align="left"
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
        </HeaderWrapper>
    )
}

export const CardContentKeys = [
    'weathercode',
    'temperature_2m_min',
    'temperature_2m_max',
]

export interface CardContentProps {
    forecastObj: DailyWeatherForecastObjectType
}
const WeatherCardContent: React.FC<CardContentProps> = ({
    forecastObj,
}: CardContentProps) => {
    //const precipType = weather.rain_sum ?
    const precipObj = forecastObj.precipitationObj
    const chanceOfRain = precipObj.chance
    const valueString = precipObj.getValueString()
    const precipString = valueString
        ? `${valueString}: ${chanceOfRain}%`
        : chanceOfRain
        ? `precip: ${chanceOfRain}%`
        : ''
    return (
        <div className={styles.bodyWrapper} style={{}}>
            <Typography variant="body1" align="center">
                {forecastObj.cloudObj.getDisplayString()}
            </Typography>
            <Typography variant="body1" align="center">
                {forecastObj.windObj.getDescription()}
            </Typography>
            <Divider />
            <Typography variant="body1" align="center">
                {precipString}
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
    const temperatureStrings =
        props.temperatureObj?.getTempDisplayStrings() ?? ['', '']
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
