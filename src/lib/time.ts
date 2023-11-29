import dayjs from 'dayjs'
import { ThemeType, themeTypeValidator } from './user'
import { PaletteMode } from '@mui/material'
/**
 * given a string of format YYYY-MM-DD, returns the day of the week
 * [Sunday-Saturday]
 * @param {string} date - YYYY-MM-DD
 * @throws {Error} - [TODO:description]
 * @returns {string} [TODO:description]
 */

export enum TimeOfDay {
    MORNING = 'morning',
    DAY = 'day',
    EVENING = 'evening',
    NIGHT = 'night',
}
export const TIMES_OF_DAY = [
    TimeOfDay.MORNING,
    TimeOfDay.DAY,
    TimeOfDay.EVENING,
    TimeOfDay.NIGHT,
] as const
export type TimeOfDayType = (typeof TIMES_OF_DAY)[number]

/**
 * @property {string | dayjs.Dayjs} time
 * @property {boolean | Promise<boolean>} isDay
 * @property {number | Promise<number>} timePercent?
 * @property {TimeOfDayType | Promise<TimeOfDayType>} timeOfDay?
 * @property {string | Promise<string>} colorOfDay?
 */
export interface TimeObjectType {
    //TODO:
    time?: string
    isDay: boolean //| Promise<boolean>
    timePercent?: number //| Promise<number>
    timeOfDay?: TimeOfDayType //| Promise<TimeOfDayType>
    colorOfDay?: string //| Promise<string>
}

export const getTimeObj = (
    forecast?: DetailedWeatherDataType,
    theme?: PaletteMode
) => {
    const curTimeMinutes = forecast?.time.includes('T')
        ? clockTimeToMinutes(forecast.time.split('T')[1])
        : !theme || theme === 'light'
        ? 900
        : 1200
    const sunriseMinutes =
        typeof forecast?.sunrise === 'string'
            ? clockTimeToMinutes(forecast.sunrise.split('T')[1])
            : 360
    const sunsetMinutes =
        typeof forecast?.sunset === 'string'
            ? clockTimeToMinutes(forecast.sunset.split('T')[1])
            : 1080
    const dayLength =
        forecast?.sunrise && forecast?.sunset
            ? dayLengthCalculator(sunriseMinutes, sunsetMinutes)
            : 720
    const { isDay, timePercent } = {
        ...calcPercentOfDayNight(
            curTimeMinutes,
            sunriseMinutes,
            sunsetMinutes,
            dayLength
        ),
    }
    const timeOfDay = getTimeOfDay(isDay, timePercent)
    return {
        time: forecast?.time,
        isDay,
        timePercent,
        timeOfDay,
    }
}

export const getTimeOfDay = (
    isDay: boolean,
    timePercent: number
): TimeOfDayType => {
    switch (isDay) {
        case true: {
            if (timePercent < 0.2) return TimeOfDay.MORNING
            else if (timePercent < 0.8) return TimeOfDay.DAY
            else return TimeOfDay.EVENING
        }
        case false: {
            if (timePercent < 0.2) return TimeOfDay.EVENING
            else if (timePercent < 0.8) TimeOfDay.NIGHT
            else return TimeOfDay.MORNING
        }
        default: {
            return TimeOfDay.NIGHT
        }
    }
}

export function getDayOfWeek(date: string): string {
    if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
        return dayjs(date).format('dddd')
    } else
        throw new SyntaxError('Invalid date format, require YYYY-MM-DD', {
            cause: date,
        })
}
export function getDateObject(date: string): dayjs.Dayjs {
    if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
        return dayjs(date)
    } else
        throw new SyntaxError('Invalid date format, require YYYY-MM-DD', {
            cause: date,
        })
}
export function getDatetimeObject(date: string): dayjs.Dayjs {
    if (dayjs(date, 'YYYY-MM-DDTHH:mm', true).isValid()) {
        return dayjs(date)
    } else
        throw new SyntaxError(
            'Invalid date format, require strict iso8601 format',
            { cause: date }
        )
}
/**
 * Maps percentage of day/night to a number between 0 and 23
 *
 * @param {boolean} isDay - [TODO:description]
 * @param {number} percent - [TODO:description]
 * @returns {string} [TODO:description]
 */
export function percentToGradientStringMapper(
    isDay: boolean,
    percent: number
): string {
    //Maps a number ranging from 0 to 1 to a number ranging from 0 to 11
    //This is used to select the appropriate color gradient
    if (isDay) return numberToHourString(Math.round(percent * 11) + 7)
    else return numberToHourString((Math.round(percent * 11) + 19) % 24)
}
/**
 * @description Calculates the percentage of the day/night that has passed.
 *
 * @param {number} curTime - [Current time in minutes]
 * @param {number} sunrise - [Sunrise time in minutes]
 * @param {number} sunset - [Sunset time in minutes]
 * @param {number} dayLength - [length of day in minutes]
 * @returns {number} [Number ranging from -1 to 1, with negatives representing night percentage]
 */
export function calcPercentOfDayNight(
    curTime: number,
    sunrise: number,
    sunset: number,
    dayLength: number
): { isDay: boolean; timePercent: number } {
    //In standard time, night is from 6pm to 6am, or 18 to 6
    const nightLength = 1440 - dayLength

    if (curTime < sunrise) {
        //Time after sunset but before midnight
        const eveningTime = nightLength - sunrise
        const nightPercent = (eveningTime + curTime) / nightLength
        return { isDay: false, timePercent: nightPercent }
    } else if (curTime > sunset) {
        const timeAfterSunset = curTime - sunset
        const nightPercent = timeAfterSunset / nightLength
        return { isDay: false, timePercent: nightPercent }
    } else {
        //should be daytime
        const timeSinceSunrise = curTime - sunrise
        const dayPercent = timeSinceSunrise / dayLength
        return { isDay: true, timePercent: dayPercent }
    }
}
/**
 * @description HH:MM to minutes
 *
 * @param {string} time - [string of format HH:MM]
 * @returns {number} - [number of minutes]
=======
 * converts a time string [HH:MM] to minutes
 *
 * @param {string} time - ["HH:MM"]
 * @returns {number} time - minutes
>>>>>>> celestial_icons
 */
export function clockTimeToMinutes(time: string): number {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!time.match(regex))
        throw new Error('Invalid time string', { cause: time })
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 60 + parseInt(minutes)
}

/**
 * takes number [0-23] and converts to string [00-23]
 *
 * @param {number} num - number [0-23]
 * @returns {string} ["00"-"23"]
 */
export function numberToHourString(num: number): string {
    return num < 10 ? '0' + num.toString() : num.toString()
}

/**
 * @description calculates the length of the day in minutes
 *
 * @param {number} sunriseMinutes
 * @param {number} sunsetMinutes
 * @returns {number} - minutes in the day that the sun is up
 */
export function dayLengthCalculator(
    sunriseMinutes: number,
    sunsetMinutes: number
): number {
    // TODO: this likely fails tests, maintenance needed
    return sunsetMinutes > sunriseMinutes
        ? sunsetMinutes - sunriseMinutes
        : 1440 - sunriseMinutes + sunsetMinutes
}
export function celestialThemeGenerator(
    time: string,
    sunrise?: string,
    sunset?: string
): ThemeType {
    const ctime = time.split('T')[1]
    if (!sunrise || !sunset) return 'hour00'
    const csunrise = sunrise.split('T')[1]
    const csunset = sunset.split('T')[1]
    const [mTime, mSunrise, mSunset] = [ctime, csunrise, csunset].map(
        clockTimeToMinutes
    )
    const dayLength = dayLengthCalculator(mSunrise, mSunset)
    const timeObject = calcPercentOfDayNight(
        mTime,
        mSunrise,
        mSunset,
        dayLength
    )
    const ret = `hour${percentToGradientStringMapper(
        timeObject.isDay,
        timeObject.timePercent
    )}`
    if (themeTypeValidator(ret)) return ret
    else throw new Error('Invalid theme type', { cause: ret })
}
