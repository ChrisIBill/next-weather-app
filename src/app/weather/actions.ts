'use server'

import { forecastFormater } from '@/lib/forecast-shaper'
import { CoordinatesType } from '@/lib/interfaces'

const WeatherAPISrc = '/SampleWeatherData.json'
const DEFAULT_WEATHER_PARAMS =
    '&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,windspeed_10m,winddirection_10m&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m,temperature_80m,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&timezone=America%2FChicago'

export async function getWeather(coords: CoordinatesType) {
    //TODO: cache handling
    const testURL = process.env.URL + WeatherAPISrc
    const result = await fetch(testURL, {
        cache: 'no-cache',
    })
    //    const reqURL =
    //        process.env.OPEN_METEO_API_URL +
    //        `?latitude=${coords.latitude}&longitude=${coords.longitude}` +
    //        DEFAULT_WEATHER_PARAMS
    //    const result = await fetch(testURL, {
    //        next: { revalidate: 3600 },
    //    })

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
