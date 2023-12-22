import PrecipitationClass, { PrecipitationClassType } from './obj/precipitation'
import WindClass, { WindClassType } from './obj/wind'
import {
    DayTemperatureClassType,
    HourTemperatureClassType,
    TemperatureClassType,
} from './obj/temperature'
import DayTimeClass, { HourTimeClass, TimeClassType } from './obj/time'
import { CloudClassType } from './obj/cloudClass'
import { LocationInterface } from './location'

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
    time2?: number
    interval?: number
    temperature_2m?: number
    relativehumidity_2m?: number
    apparent_temperature?: number
    precipitation?: number
    rain?: number
    showers?: number
    snowfall?: number
    weathercode?: number
    cloudcover?: number
    pressure_msl?: number
    surface_pressure?: number
    windspeed_10m?: number
    winddirection_10m?: number
    windgusts_10m?: number
    sunrise?: number
    sunset?: number
    [index: string]: {} | string | number | undefined
}
export interface HourlyWeatherDataType {
    time?: string
    time2?: number
    temperature_2m?: number
    relativehumidity_2m?: number
    dewpoint_2m?: number
    apparent_temperature?: number
    precipitation_probability?: number
    precipitation?: number
    rain?: number
    showers?: number
    snowfall?: number
    snow_depth?: number
    weathercode?: number
    cloudcover?: number
    pressure_msl?: number
    surface_pressure?: number
    windspeed_10m?: number
    winddirection_10m?: number
    windgusts_10m?: number
    uv_index?: number
    visibility?: number
    [index: string]: {} | string | number | undefined
}
export interface DailyWeatherDataType {
    time?: string
    time2?: number
    weathercode?: number
    avg_cloudcover?: number
    temperature_2m_max?: number
    temperature_2m_min?: number
    apparent_temperature_max?: number
    apparent_temperature_min?: number
    sunrise?: number
    sunrise2?: number
    sunset?: number
    sunset2?: number
    uv_index_max?: number
    precipitation_sum?: number
    rain_sum?: number
    showers_sum?: number
    snowfall_sum?: number
    precipitation_hours?: number
    precipitation_probability_max?: number
    windspeed_10m_max?: number
    windgusts_10m_max?: number
    winddirection_10m_dominant?: number
    [index: string]: {} | number | string | undefined
}
export interface ForecastObjectType {
    timeObj: TimeClassType
    precipitationObj: PrecipitationClassType
    windObj: WindClassType
    temperatureObj: TemperatureClassType
    cloudObj: CloudClassType
    hourly_weather?: ForecastObjectType[]
    current_weather?: ForecastObjectType
    //clouds: CloudsClass
    //cloud_cover: number
}
export interface DailyWeatherForecastObjectType extends ForecastObjectType {
    timeObj: DayTimeClass
    precipitationObj: PrecipitationClassType
    temperatureObj: DayTemperatureClassType
    hourly_weather: HourlyForecastObjectType[]
    current_weather?: ForecastObjectType
    cloudObj: CloudClassType
}
export interface ForecastObjectMetadataType {
    location?: LocationInterface
}
export interface FullForecastObjectType {
    forecast: DailyWeatherForecastObjectType[]
    metadata: ForecastObjectMetadataType
}
export interface HourlyForecastObjectType extends ForecastObjectType {
    timeObj: HourTimeClass
    precipitationObj: PrecipitationClassType
    temperatureObj: HourTemperatureClassType
    cloudObj: CloudClassType
    hourly_weather?: undefined
    current_weather?: undefined
    [key: string]: any
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
export type StringLiteralType<T> = T extends string
    ? string extends T
        ? never
        : T
    : never
export type StringLiteralUnion<T extends U, U = string> = T | (U & {})
