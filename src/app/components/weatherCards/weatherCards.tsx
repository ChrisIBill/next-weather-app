import { CoordinatesType } from '@/app/geolocation/page'
import { WeatherCard, WeatherCardProps } from './weatherCard'
import styles from './weatherCards.module.scss'
import {
    DailyWeatherForecastObjectType,
    DailyWeatherForecastType,
} from '@/lib/interfaces'
import { Skeleton } from '@mui/material'
import dayjs from 'dayjs'
import React, { ReactHTMLElement, useEffect } from 'react'

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
            <div key={index} className={styles.cardWrapper}>
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
        <div className={styles.cardsListWrapper} ref={listWrapper}>
            <ul className={styles.cardsList}>{weatherCards}</ul>
        </div>
    )
}
