'use server'

import { CoordinatesType } from '@/lib/interfaces'

const WeatherAPISrc = '/FarTestWeatherData.json'

export async function getWeather(coords: CoordinatesType) {
    let weatherData
    return fetch(process.env.URL + WeatherAPISrc)
        .then((res) => res.json())
        .then(
            (result) => {
                console.log('Weather data fetched')
                console.log(result)
                result
            },
            (error) => {
                console.log(error.message)
                console.log('Error with fetching weather data')
                error
            }
        )
}
