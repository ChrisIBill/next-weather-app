import { WeatherCard, WeatherCardProps } from './weatherCard'
import styles from './weatherCards.module.scss'
import { DailyWeatherForecastObjectType } from '@/lib/interfaces'
import { Skeleton } from '@mui/material'
import React from 'react'
import { Draggable } from '../draggable'

export interface WeatherCardsProps {
    forecastObj: DailyWeatherForecastObjectType[]
}
export const WeatherCards: React.FC<WeatherCardsProps> = (
    props: WeatherCardsProps
) => {
    const listWrapper = React.useRef<HTMLDivElement>(null)

    //If after sunset, show tomorrow's forecast first
    let showTomorrowFirst = false
    //if (todaysForecast?.current_weather?.time) {
    //    const time = dayjs(todaysForecast.current_weather.time)
    //    showTomorrowFirst = !time.isBefore(todaysForecast.sunset)
    //}
    console.log('Forecast Object: ', props.forecastObj)
    const setScrollPosition = (element: any) => {
        element.current.scrollLeft = 1000
    }

    //need a generator to create the formatted data for the cards
    const weatherCards = props.forecastObj.slice(0, 7).map((weather, index) => {
        return (
            <div key={index} className={styles.cardWrapper} style={{}}>
                {weather ? (
                    <WeatherCard
                        forecastObj={props.forecastObj[index]}
                        index={index}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={210} height={118} />
                )}
            </div>
        )
    })

    //useEffect(() => {
    //    if (showTomorrowFirst) setScrollPosition(listWrapper)
    //}, [])
    return (
        <Draggable>
            <div
                className={styles.cardsListWrapper}
                ref={listWrapper}
                style={{
                    width: '100%',
                    overflow: 'scroll',
                }}
            >
                <ul className={styles.cardsList}>{weatherCards}</ul>
            </div>
        </Draggable>
    )
}
