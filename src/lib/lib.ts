import { PosCoordinates } from './interfaces'

const ApiTempUnits = ['Fahrenheit', 'Celsius'] as const
const ApiWindUnits = ['Mph', 'Kph', 'Mps', 'knots'] as const
const ApiPrecipitationUnits = ['in', 'mm'] as const
export const ApiUnits = {
    ApiTempUnits,
    ApiWindUnits,
    ApiPrecipitationUnits,
}
export type ApiTempUnitType = (typeof ApiTempUnits)[number]
export type ApiWindUnitType = (typeof ApiWindUnits)[number]
export type ApiPrecipitationUnitType = (typeof ApiPrecipitationUnits)[number]

export interface ApiUnitsInterface {
    temperature_unit?: ApiTempUnitType
    wind_speed_unit?: ApiWindUnitType
    precipitation_unit?: ApiPrecipitationUnitType
}

function displayTodayOrTomorrow() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const todayString = today.toDateString()
    const tomorrowString = tomorrow.toDateString()
}

export function weatherImgGenerator(str: string | undefined) {
    switch (str) {
        case 'Thunderstorm':
            return '/weather-images/id2xx.jpg'
        case 'Drizzle':
            return '/weather-images/id3xx-5xx.jpg'
        case 'Rain':
            return '/weather-images/id3xx-5xx.jpg'
        case 'Snow':
            return '/weather-images/id6xx.jpg'
        case 'Clear':
            return '/weather-images/id800.jpg'
        case 'Clouds':
            return '/weather-images/id80x.jpg'
        default:
            return '/weather-images/errImg.jpg'
    }
}

/**
 * Returns a promis that resolves if cancelled
 *
 * @param {Promise<any | void>} promise - [TODO:description]
 * @returns {[TODO:type]} [TODO:description]
 */
export const cancellablePromise = (promise: Promise<any | void>) => {
    const isCancelled = { value: false }
    const wrappedPromise = new Promise((resolve, reject) => {
        promise
            .then((d) => {
                return isCancelled.value ? reject(isCancelled) : resolve(d)
            })
            .catch((e) => {
                reject(isCancelled.value ? isCancelled : e)
            })
    })

    return {
        promise: wrappedPromise,
        cancel: () => {
            isCancelled.value = true
        },
    }
}

/**
<<<<<<< HEAD
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

/**
 * @description given a point [0-1] and a set of constant control points, returns a point along
 * the bezier curve
 *
 * @param {number} t - a point ranging from 0 to 1
 * @param {PosCoordinates} p0 - {x: number, y: number} control point 1
 * @param {PosCoordinates} p1 - {x: number, y: number} control point 2
 * @param {PosCoordinates} p2 - {x: number, y: number} control point 3
 * @param {PosCoordinates} p3 - {x: number, y: number} control point 4
 * @returns {PosCoordinates} - {x: number, y: number} point along the bezier curve
 */
export function bezierCurve(
    t: number,
    p0: PosCoordinates,
    p1: PosCoordinates,
    p2: PosCoordinates,
    p3: PosCoordinates
): PosCoordinates {
    const cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX

    const cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY

    const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x
    const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y

    return { x: x, y: y }
}

/**
 * Given an array of strings and a given string in the array, returns a generator of that array
 * @generator
 * @param {string} s - a string in the array
 * @param {string[]} strs - an array of string
 */
export const stringLiteralGenerator = function* (
    s: string,
    strs: readonly string[]
) {
    let i = strs.indexOf(s)
    while (i < strs.length) {
        yield strs[strs.indexOf(s) + 1]
        if (i === strs.length - 1) i = 0
        else i++
    }
}
