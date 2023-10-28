import {
    DailyWeatherForecastType,
    HourlyWeatherDataType,
    UserWeatherDataType,
} from './interfaces'

function getApiMetadata(weatherApiData: any) {
    try {
        const units = {
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
    const hdf = weatherApiData.hourly

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
            ret[i] = {}
            hdf_keys.forEach(
                (key: string) => (ret[i][key] = hdf[key][r + i] as string)
            )
        }
        return ret
    }

    const weather_forecast: DailyWeatherForecastType[] = new Array(8)
        .fill({})
        .map(
            (day, index) =>
                (day = {
                    date: adf.time[index],
                    weathercode: adf.weathercode[index],
                    temperature_2m_max: adf.temperature_2m_max[index],
                    temperature_2m_min: adf.temperature_2m_min[index],
                    apparent_temperature_max:
                        adf.apparent_temperature_max[index],
                    apparent_temperature_min:
                        adf.apparent_temperature_min[index],
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
                    hourly_weather: getHourlyWeather(adf.time[index], index),
                })
        )
    return JSON.stringify({
        metadata: metadata,
        current: current_weather,
        daily: weather_forecast,
    })
    //return {metadata, current_weather, weather_forecast[8]}
}
