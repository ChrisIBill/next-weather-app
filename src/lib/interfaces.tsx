import { TemperatureUnitType } from './user'

export interface WeatherReportDataType {
    time: string
    temperature_2m?: string
    temperature_2m_max?: string
    temperature_2m_min?: string
    apparent_temperature?: string
    apparent_temperature_max?: string
    apparent_temperature_min?: string
    relativehumidity_2m?: string
    dewpoint_2m?: string
    precipitation?: string
    precipitation_probability?: string
    precipitation_sum?: string
    precipitation_probability_max?: string
    precipitation_hours?: string
    rain?: string
    rain_sum?: string
    showers?: string
    showers_sum?: string
    snowfall?: string
    snowfall_sum?: string
    snow_depth?: string
    weathercode?: string
    cloudcover?: string
    sunrise?: string
    sunset?: string
    pressure_msl?: string
    surface_pressure?: string
    visibility?: string
    windspeed_10m?: string
    windspeed_10m_max?: string
    winddirection_10m?: string
    winddirection_10m_dominant?: string
    windgusts_10m?: string
    windgusts_10m_max?: string
    uv_index?: string
    hourly_weather: HourlyWeatherDataType[]
}
export interface LocationType {
    zipCode?: string
    city?: string
    state?: string
    country?: string
    address?: string
    latitude?: number
    longitude?: number
}
export interface PosCoordinates {
    x: number
    y: number
}
export interface DimensionsType {
    width: number
    height: number
}
export interface UserWeatherDataType {
    metadata: WeatherMetadata
    current: CurrentWeatherDataType
    daily: DailyWeatherForecastType[]
}
export interface WeatherUnitsType {
    all: {
        [key: string]: string
    }
    current: {
        [key: string]: string
    }
    hourly: {
        [key: string]: string
    }
    daily: {
        [key: string]: string
    }
}
export interface WeatherMetadata {
    latitude: string
    longitude: string
    elevation: string
    timezone: string
    units: WeatherUnitsType
    generationTime?: string
}
export interface CurrentWeatherDataType {
    time?: string
    interval?: string
    temperature_2m?: string
    relativehumidity_2m?: string
    apparent_temperature?: string
    precipitation?: string
    rain?: string
    showers?: string
    snowfall?: string
    weathercode?: string
    cloudcover?: string
    pressure_msl?: string
    surface_pressure?: string
    windspeed_10m?: string
    winddirection_10m?: string
    windgusts_10m?: string
    sunrise?: string
    sunset?: string
    [index: string]: {} | string | undefined
}
export interface HourlyWeatherDataType {
    time?: string
    temperature_2m?: string
    relativehumidity_2m?: string
    dewpoint_2m?: string
    apparent_temperature?: string
    precipitation_probability?: string
    precipitation?: string
    rain?: string
    showers?: string
    snowfall?: string
    snow_depth?: string
    weathercode?: string
    cloudcover?: string
    pressure_msl?: string
    surface_pressure?: string
    windspeed_10m?: string
    winddirection_10m?: string
    windgusts_10m?: string
    uv_index?: string
    visibility?: string
    [index: string]: {} | string | undefined
}
export interface DailyWeatherDataType {
    time?: string
    weathercode?: string
    temperature_2m_max?: number
    temperature_2m_min?: number
    apparent_temperature_max?: number
    apparent_temperature_min?: number
    sunrise?: string
    sunset?: string
    uv_index_max?: string
    precipitation_sum?: string
    rain_sum?: string
    showers_sum?: string
    snowfall_sum?: string
    precipitation_hours?: string
    precipitation_probability_max?: string
    windspeed_10m_max?: string
    windgusts_10m_max?: string
    winddirection_10m_dominant?: string
    [index: string]: {} | number | string | undefined
}
export type DetailedWeatherDataType = CurrentWeatherDataType &
    HourlyWeatherDataType &
    DailyWeatherDataType
export interface DailyWeatherDetailsType {
    hourly_weather: HourlyWeatherDataType[]
    current_weather?: CurrentWeatherDataType
}
export type DailyWeatherForecastType = DailyWeatherDetailsType &
    DailyWeatherDataType

export type WeatherForecastType = DailyWeatherForecastType[]
export interface WeatherApiResponseType {
    forecast: WeatherForecastType
    metadata: WeatherMetadata
}
export interface CoordinatesType {
    latitude: number
    longitude: number
}

export interface AreaChartDataType {
    label: string
    data: number[]
    fill: any
    borderColor: string
    backgroundColor: string
    borderWidth: number
    [propName: string]: any
}
export interface AreaChartHandlerProps {
    labels: Array<string>
    datasets: Array<Array<number | undefined>>
    labelDatasets: Array<string>
    title?: string
}
