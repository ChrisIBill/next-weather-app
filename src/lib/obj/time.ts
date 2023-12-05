import dayjs from 'dayjs'
import { DetailedWeatherDataType } from '../interfaces'

export const TIME_OF_DAY_STRINGS = [
    'morning',
    'day',
    'evening',
    'night',
] as const
export const TIME_TYPES = ['day', 'hour']
export type TimeOfDayType = (typeof TIME_OF_DAY_STRINGS)[number]
export type TimeType = (typeof TIME_TYPES)[number]

export interface TimeClassType {
    value: number
    sunrise: number
    sunset: number
    obj: dayjs.Dayjs
    dayOfWeekString: string | (() => string)
    dateString: string | (() => string)
}

export interface DayTimeClassType extends TimeClassType {
    hours: TimeClassType[]
}

export default class DayTimeClass implements DayTimeClassType {
    value: number
    sunrise: number
    sunset: number
    obj: dayjs.Dayjs
    current?: HourTimeClassType
    hours: HourTimeClassType[]
    dayOfWeekString: string | (() => string)
    dateString: string | (() => string)
    constructor(value: number, sunrise?: number, sunset?: number) {
        this.value = value
        this.obj = dayjs.unix(value)
        this.sunrise = sunrise || value + 21600 //6:00 AM
        this.sunset = sunset || value + 64800 //6:00 PM
        this.hours = this.constructHours()
        this.dayOfWeekString = this.calcDayOfWeekString.bind(this)
        this.dateString = this.calcDateString.bind(this)
    }
    constructHours = () => {
        const hours = []
        for (let i = 0; i < 24; i++) {
            hours.push(
                new HourTimeClass(
                    this.value + i * 3600,
                    this.sunrise,
                    this.sunset,
                    this
                )
            )
        }
        return hours
    }
    setCurrent = (value: number) => {
        this.current = new HourTimeClass(value, this.sunrise, this.sunset, this)
    }

    private calcDayOfWeekString = () => {
        try {
            console.log('im running')
            const str = this.obj.format('ddd')
            this.dayOfWeekString = str
            return this.dayOfWeekString
        } catch (e) {
            return `Error: ${e}`
        }
    }
    private calcDateString = () => {
        try {
            return dayjs(this.value).format('MMM D')
        } catch (e) {
            return `Error: ${e}`
        }
    }
}

export interface HourTimeClassType extends TimeClassType {
    day: DayTimeClassType
    isDay: (() => boolean) | boolean
    clockString: (() => string) | string
    timePercent: (() => number) | number
    timeOfDay: (() => TimeOfDayType) | TimeOfDayType
}

export class HourTimeClass implements HourTimeClassType {
    value: number
    sunrise: number
    sunset: number
    obj: dayjs.Dayjs
    day: DayTimeClassType
    dayOfWeekString: (() => string) | string
    dateString: (() => string) | string
    isDay: (() => boolean) | boolean
    constructor(
        value: number,
        sunrise: number,
        sunset: number,
        day: DayTimeClassType
    ) {
        this.value = value
        this.obj = dayjs.unix(value)
        this.sunrise = sunrise
        this.sunset = sunset
        this.day = day
        this.isDay = this.calcIsDay.bind(this)
        this.clockString = this.clockString.bind(this)
        this.timePercent = this.timePercent.bind(this)
        this.timeOfDay = this.timeOfDay.bind(this)
        this.dayOfWeekString = day.dayOfWeekString
        this.dateString = day.dateString
    }
    private calcIsDay = () => {
        try {
            const sunrise = dayjs(this.sunrise)
            const sunset = dayjs(this.sunset)
            return this.obj.isAfter(sunrise) && this.obj.isBefore(sunset)
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    clockString = () => {
        try {
            return this.obj.format('h:mm A')
        } catch (e) {
            return `Error: ${e}`
        }
    }
    timePercent = () => {
        try {
            const sunrise = dayjs(this.sunrise)
            const sunset = dayjs(this.sunset)
            const dayLength = sunset.diff(sunrise, 'minute')
            const curTime = this.obj.diff(sunrise, 'minute')
            return curTime / dayLength
        } catch (e) {
            console.log(e)
            return NaN
        }
    }
    timeOfDay = () => {
        try {
            const timePercent = this.timePercent()
            if (timePercent < 0.25) return 'night'
            if (timePercent < 0.5) return 'morning'
            if (timePercent < 0.75) return 'day'
            return 'evening'
        } catch (e) {
            console.log(e)
            return 'day'
        }
    }
}
//    export const getTimeObj = (
//    forecast?: DetailedWeatherDataType,
//) => {
//    try {
//        const curMinutes =
//
//    } catch (e) {
//    }
//    const curTimeMinutes = forecast?.time.includes('T')
//        ? clockTimeToMinutes(forecast.time.split('T')[1])
//        : -100'
//    const sunriseMinutes =
//        typeof forecast?.sunrise === 'string'
//            ? clockTimeToMinutes(forecast.sunrise.split('T')[1])
//            : 360
//    const sunsetMinutes =
//        typeof forecast?.sunset === 'string'
//            ? clockTimeToMinutes(forecast.sunset.split('T')[1])
//            : 1080
//    const dayLength =
//        forecast?.sunrise && forecast?.sunset
//            ? dayLengthCalculator(sunriseMinutes, sunsetMinutes)
//            : 720
//    const { isDay, timePercent } = {
//        ...calcPercentOfDayNight(
//            curTimeMinutes,
//            sunriseMinutes,
//            sunsetMinutes,
//            dayLength
//        ),
//    }
//    const timeOfDay = getTimeOfDay(isDay, timePercent)
//    return {
//        time: forecast?.time,
//        isDay,
//        timePercent,
//        timeOfDay,
//    }
//}
