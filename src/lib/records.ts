export interface WeatherTitlesDataType {
    [key: string]: {
        short: string
        long?: string
        icon?: any
    }
}
export const WeatherDataKeysMap: WeatherTitlesDataType = {
    time: { short: 'Time' },
    temperature_2m: { short: 'Temp', long: 'Temperature @ 2m' },
    apparent_temperature_2m: {
        short: 'Feels Like',
        long: 'Apparent Temperature @ 2m',
    },
    precipitation: { short: 'Precip.', long: 'Precipitation' },
    precipitation_probability: {
        short: 'Precip. %',
        long: 'Precipitation Probability',
    },
    rain: { short: 'Rain', long: 'Rain' },
    showers: { short: 'Showers' },
    snowfall: { short: 'Snow' },
    weathercode: { short: 'Code', long: 'Weather Code' },
    cloudcover: { short: 'Clouds', long: 'Cloud Coverage' },
    windspeed_10m: { short: 'Wind Speed', long: 'Wind Speed @ 10m' },
    windgusts_10m: { short: 'Wind Gusts', long: 'Wind Gusts @ 10m' },
    uv_index: { short: 'UV', long: 'UV Index' },
    visibility: { short: 'Vis.', long: 'Visibility' },
} as const
