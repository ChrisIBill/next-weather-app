'use server'

import { forecastFormater } from '@/lib/forecast-shaper'
import { CoordinatesType, LocationType } from '@/lib/interfaces'
import logger from '@/lib/pinoLogger'
const DEFAULT_WEATHER_PARAMS =
    '&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weathercode,cloudcover,pressure_msl,surface_pressure,windspeed_10m,winddirection_10m&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m,temperature_80m,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&forecast_days=8&'

const actionsLogger = logger.child({ module: 'Weather Server Actions' })
interface LocationInterface {
    coords: CoordinatesType
    address: any
}

async function handleLocation(
    location: LocationType
): Promise<LocationInterface> {
    if (location.latitude && location.longitude) {
        const geocodingURL =
            process.env.GEOCODING_API_URL +
            '?latlng=' +
            location.latitude +
            ',' +
            location.longitude +
            '&key=' +
            process.env.GOOGLE_API_KEY
        const result = await fetch(geocodingURL)
        const data = await result.json()
        return {
            coords: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            address: data,
        }
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
                coords: {
                    latitude: data.results[0].geometry.location.lat,
                    longitude: data.results[0].geometry.location.lng,
                } as CoordinatesType,
                address: data,
            }
        } else
            throw new Error('Failed to get coordinates', {
                cause: 'Bad Response from Google: ' + result,
            })
    } else
        throw new Error('Failed to get coordinates', {
            cause: 'Bad Location Object: ' + location,
        })
}

export async function getWeather(location: LocationType) {
    //TODO: cache handling
    try {
        const { coords, address } = await handleLocation(location)
        //Coords are critical, address is not so will conditionally catch ReferenceError
        if (!coords)
            throw new Error('Coordinates undefined', { cause: location })
        if (!address)
            throw new ReferenceError('Address undefined', { cause: location })
        actionsLogger.info('Coordinates from geocoding: ', coords, address)
        const reqURL =
            process.env.OPEN_METEO_API_URL +
            `?latitude=${coords.latitude}&longitude=${coords.longitude}` +
            DEFAULT_WEATHER_PARAMS

        const result = await fetch(reqURL, {
            next: { revalidate: 3600 },
        })

        if (!result.ok) {
            actionsLogger.error(result.status)
            return JSON.stringify({
                result: result.status,
                forecast: null,
                address,
            })
        }
        return JSON.stringify({
            result: result.status,
            forecast: forecastFormater(await result.json()),
            address,
        })
    } catch (e) {
        actionsLogger.error(e)
        if (e instanceof ReferenceError) {
            //Error is recoverable
        } else {
            //Error is not recoverable
            return JSON.stringify({
                result: 500,
                forecast: null,
                address: null,
            })
        }
    }
}
