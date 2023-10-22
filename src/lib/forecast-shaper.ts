import { DailyWeatherCardType } from "./interfaces"

export function forecastFormater(weatherApiData) {
    const metadata = {
        latitude: weatherApiData.latitude,
        longitude: weatherApiData.longitude,
        timezone: weatherApiData.timezone,
        elevation: weatherApiData.elevation,
    }
    const current_weather = {
        units: weatherApiData.current_units,
        weather: weatherApiData.current_weather,
    }
    const weather_forecast: DailyWeatherCardType[] = new Array(7).fill({})

    //return {metadata, current_weather, weather_forecast[8]}
}
