//import {
//    WeatherApiResponseType,
//    WeatherMetadata,
//    WeatherForecastType,
//    DailyWeatherForecastType,
//} from '@/lib/interfaces'
//
//function objectDeepFormatter(obj: any, func: (k: string, v: any) => any) {
//    for (const key in obj) {
//        if (typeof obj[key] == 'object')
//            obj[key] = objectDeepFormatter(obj[key], func)
//        else obj[key] = func(key, obj[key])
//    }
//    return obj
//}
//
//export function weatherApiHandler(value: WeatherApiResponseType) {
//    //Wraps convertable values in their respective classes
//    const metadata: WeatherMetadata = value.metadata
//    const forecast: WeatherForecastType = Array(8).fill({})
//
//    function weatherApiFormatter(key: string, elem: string | number) {
//        if (key.includes('temperature')) {
//            const temp: number = +elem
//            return new TemperatureClass(
//                temp,
//                metadata.units.all[key] as ApiTempUnitStrings
//            )
//        } else return elem
//    }
//
//    value.forecast.map((day: DailyWeatherForecastType, index) => {
//        forecast[index] = objectDeepFormatter(day, weatherApiFormatter)
//    })
//    console.log('Client forecast: ', forecast)
//    return { forecast, metadata }
//}
