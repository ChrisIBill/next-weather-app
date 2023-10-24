'use server'

import { forecastFormater } from '@/lib/forecast-shaper'
import { CoordinatesType } from '@/lib/interfaces'

const WeatherAPISrc = '/SampleWeatherData.json'

export async function getWeather(coords: CoordinatesType) {
    //TODO: cache handling
    const result = await fetch(process.env.URL + WeatherAPISrc, {
        cache: 'no-store',
    })

    if (!result.ok) {
        console.error(result.status)
        throw new Error('Error with fetching weather data')
    }
    return forecastFormater(await result.json())
    //return result.json()
    //    return fetch(process.env.URL + WeatherAPISrc)
    //        .then((res) => res.json())
    //        .then(
    //            (result) => {
    //                console.log('Weather data fetched')
    //                console.log(result)
    //                result
    //            },
    //            (error) => {
    //                console.log(error.message)
    //                console.log('Error with fetching weather data')
    //                error
    //            }
    //        )
}
