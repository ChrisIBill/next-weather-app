import { WeatherCard, WeatherCardProps } from './weatherCard'
import styles from './weatherCards.module.scss'
import { DailyWeatherForecastObjectType } from '@/lib/interfaces'
import { Container, Skeleton, styled } from '@mui/material'
import React from 'react'
import { Draggable } from '../draggable'
import { log } from 'next-axiom'
import { inspect } from 'util'

const CardListWrapperStyled = styled('div')(({ theme }) => ({
    //width: 'fit-content',
    margin: '1.5rem 0',
    [theme.breakpoints.only('xs')]: {
        marginBottom: '2rem',
        width: '100%',
        height: '13.1rem',
        overflow: 'scroll',
    },
    [theme.breakpoints.only('sm')]: {
        height: '12.5rem',
        marginRight: '5rem',
        width: '35rem',
        overflow: 'visible',
    },
    [theme.breakpoints.only('md')]: {
        height: '15rem',
        marginRight: '6rem',
        width: '42rem',
    },
    [theme.breakpoints.up('lg')]: {
        height: '17.5rem',
        marginRight: '7rem',
        width: '49rem',
    },
}))

const CardWrapperStyled = styled('div')(({ theme }) => ({
    height: 'auto',
    [theme.breakpoints.only('xs')]: {
        width: '5rem',
    },
    [theme.breakpoints.only('sm')]: {
        width: '5rem',
    },
    [theme.breakpoints.only('md')]: {
        width: '6rem',
    },
    [theme.breakpoints.up('lg')]: {
        width: '7rem',
    },
}))
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
    const setScrollPosition = (element: any) => {
        element.current.scrollLeft = 1000
    }

    //need a generator to create the formatted data for the cards
    const weatherCards = props.forecastObj.slice(0, 7).map((weather, index) => {
        return (
            <CardWrapperStyled
                key={index}
                className={styles.cardWrapper}
                style={{}}
            >
                {weather ? (
                    <WeatherCard
                        forecastObj={props.forecastObj[index]}
                        index={index}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={210} height={118} />
                )}
            </CardWrapperStyled>
        )
    })

    //useEffect(() => {
    //    if (showTomorrowFirst) setScrollPosition(listWrapper)
    //}, [])
    return (
        <CardListWrapperStyled
            className={styles.cardsListWrapper}
            ref={listWrapper}
            style={{}}
        >
            <ul className={styles.cardsList}>{weatherCards}</ul>
        </CardListWrapperStyled>
    )
}
