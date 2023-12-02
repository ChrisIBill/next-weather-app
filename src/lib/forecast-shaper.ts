import {
    DailyWeatherForecastType,
    HourlyWeatherDataType,
    UserWeatherDataType,
    WeatherForecastType,
} from './interfaces'
import { flattenObject } from './lib'

function getApiMetadata(weatherApiData: any) {
    try {
        const units = {
            all: flattenObject({
                ...weatherApiData.current_units,
                ...weatherApiData.hourly_units,
                ...weatherApiData.daily_units,
            }),
            current: weatherApiData.current_units,
            hourly: weatherApiData.hourly_units,
            daily: weatherApiData.daily_units,
        }
        return {
            latitude: weatherApiData.latitude,
            longitude: weatherApiData.longitude,
            timezone: weatherApiData.timezone,
            elevation: weatherApiData.elevation,
            units: units,
        }
    } catch (e) {
        throw new Error('Error getting metadata from weatherApiData')
    }
}

export function forecastFormater(weatherApiData: any): string {
    //TODO: add error handling
    const metadata = getApiMetadata(weatherApiData)
    const current_weather = weatherApiData.current
    //NOTE: are we certain that the first index of each array is the current weather?
    current_weather.sunrise = weatherApiData.daily.sunrise[0]
    current_weather.sunset = weatherApiData.daily.sunset[0]

    const adf = weatherApiData.daily
    const adu = weatherApiData.daily_units
    const hdf = weatherApiData.hourly
    const hdu = weatherApiData.hourly_units

    const hdf_keys = Object.keys(weatherApiData.hourly)
    function getHourlyWeather(
        date: string,
        index: number
    ): HourlyWeatherDataType[] {
        //Should be faster to search by index, but cant be sure hours match up so will need some form of check
        //If check fails, then hours likely completely off, so either need to throw error or attempt to build
        //hourly weather data from date string
        const r = index * 24
        const ret: HourlyWeatherDataType[] = new Array(24)
        for (let i = 0; i < 24; i++) {
            if (!hdf.time[r + i].includes(date))
                throw new RangeError(
                    'Hourly weather data does not match date',
                    { cause: `Hourly Time ${hdf.time[r + i]} Date: ${date}` }
                )
            ret[i] = {
                time: hdf.time[r + i],
            }
            hdf_keys.forEach(
                (key: string) => (ret[i][key] = hdf[key][r + i] as string)
            )
        }
        return ret
    }

    //TODO: Make this generic
    function getAvgCloudCover(index: number): number {
        const r = index * 24
        let sum = 0
        for (let i = 0; i < 24; i++) {
            sum += hdf.cloudcover[r + i]
        }
        return Math.round(sum / 24)
    }

    const avg_cloudcover = getAvgCloudCover(0)

    const weather_forecast: WeatherForecastType = new Array(8)
        .fill({})
        .map((day, index) => {
            const dsum = getAvgCloudCover(index)
            return {
                time: adf.time[index],
                weathercode: adf.weathercode[index],
                temperature_2m_max: adf.temperature_2m_max[index],
                temperature_2m_min: adf.temperature_2m_min[index],
                apparent_temperature_max: adf.apparent_temperature_max[index],
                apparent_temperature_min: adf.apparent_temperature_min[index],
                sunrise: adf.sunrise[index],
                sunset: adf.sunset[index],
                uv_index_max: adf.uv_index_max[index],
                precipitation_sum: adf.precipitation_sum[index],
                rain_sum: adf.rain_sum[index],
                showers_sum: adf.showers_sum[index],
                snowfall_sum: adf.snowfall_sum[index],
                precipitation_hours: adf.precipitation_hours[index],
                precipitation_probability_max:
                    adf.precipitation_probability_max[index],
                windspeed_10m_max: adf.windspeed_10m_max[index],
                windgusts_10m_max: adf.windgusts_10m_max[index],
                winddirection_10m_dominant:
                    adf.winddirection_10m_dominant[index],
                avg_cloudcover: dsum.toString(),
                hourly_weather: getHourlyWeather(adf.time[index], index),
                current_weather: index === 0 ? current_weather : undefined,
            }
        })
    return JSON.stringify({
        metadata: metadata,
        forecast: weather_forecast,
    })
    //return {metadata, current_weather, weather_forecast[8]}
}
