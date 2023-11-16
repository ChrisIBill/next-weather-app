import { DetailedWeatherDataType } from './interfaces'

export const RAIN_THRESHOLD = [0.02, 0.2]

export function precipitationHandler(forecast: DetailedWeatherDataType) {
    const func = (s: string = '') => (isNaN(parseFloat(s)) ? 0 : parseFloat(s))
    const precip = func(forecast.precipitation)
    const [rain, showers, snow] = [
        func(forecast.rain),
        func(forecast.showers),
        func(forecast.snowfall),
    ]
    console.log('precipHandler: ', rain, showers, snow, precip)
    const strAmount = () => {
        if (precip === 0) return 'No'
        if (precip < RAIN_THRESHOLD[0]) return 'Light'
        if (precip < RAIN_THRESHOLD[1]) return 'Moderate'
        return 'Heavy'
    }
    const precipType = () => {
        if (snow > 0) return 'Snow'
        if (showers > 0) return 'Showers'
        return 'Rain'
    }
    return {
        string: strAmount() + ' ' + precipType(),
        alt: `${precip} of ${precipType()}`,
    }
}
