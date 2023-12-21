'use server'

import { forecastFormater } from '@/lib/forecast-shaper'
import { CoordinatesType, LocationType } from '@/lib/interfaces'
import { ApiUnitsInterface, formatUserPrefs } from '@/lib/lib'
import { UserPreferencesInterface } from '@/lib/stores'

const WeatherAPISrc = '/SampleWeatherData.json'
const DEFAULT_WEATHER_PARAMS =
    '&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,windspeed_10m,winddirection_10m&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m,temperature_80m,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&forecast_days=8&'
//timeformat=unixtime
const DEFAULT_WEATHER_TIMEZONE = '&timezone=America%2FChicago'

async function getCoords(location: LocationType): Promise<CoordinatesType> {
    if (location.latitude && location.longitude) {
        return { latitude: location.latitude, longitude: location.longitude }
    } else if (location.address) {
        const geocodingURL =
            process.env.GEOCODING_API_URL +
            '?address=' +
            location.address +
            '&key=' +
            process.env.GOOGLE_API_KEY
        const result = await fetch(geocodingURL)
        if (result.status === 200) {
            const data = await result.json()
            return {
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
            }
        }
    } else throw new Error('Failed to get coordinates, invalid location data')
    throw new Error('Why is this needed')
}

//function getUnitsReqURL(unitPrefs: UserPreferencesInterface): string {
//    console.log('unitPrefs: ', unitPrefs)
//    const tempUnitReq = unitPrefs.tempUnit
//        ? `&temperature_unit=${formatUserPrefs(unitPrefs.tempUnit)}`
//        : ''
//    const windUnitReq = unitPrefs.windSpeedUnit
//        ? `&wind_speed_unit=${formatUserPrefs(unitPrefs.windSpeedUnit)}`
//        : ''
//    const precipitationUnitReq = unitPrefs.precipitationUnit
//        ? `&precipitation_unit=${formatUserPrefs(unitPrefs.precipitationUnit)}`
//        : ''
//    return tempUnitReq + windUnitReq + precipitationUnitReq
//}
export async function getWeather(location: LocationType) {
    //TODO: cache handling
    const coords: CoordinatesType = await getCoords(location)
    if (!coords) {
        console.log('bad coords')
    } else console.log('Coordinates from geocoding: ', coords)
    //const testURL = process.env.URL + WeatherAPISrc
    //const result = await fetch(testURL, {
    //    cache: 'no-cache',
    //})
    const reqURL =
        process.env.OPEN_METEO_API_URL +
        `?latitude=${coords.latitude}&longitude=${coords.longitude}` +
        DEFAULT_WEATHER_PARAMS +
        DEFAULT_WEATHER_TIMEZONE

    console.log('reqURL: ', reqURL)

    const result = await fetch(reqURL, {
        next: { revalidate: 3600 },
    })

    if (!result.ok) {
        console.error(result.status)
        throw new Error('Error with fetching weather data')
    }
    return forecastFormater(await result.json())
}
