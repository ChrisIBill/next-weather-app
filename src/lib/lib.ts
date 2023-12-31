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
    let i = 0
    if (strs.includes(s)) i = strs.indexOf(s)
    while (true) {
        yield strs[i]
        i = (i + 1) % strs.length
    }
}

/**
 * @description Given a string, returns a string of only lowercase letters
 *
 * @param {string} str - A string to be formatted
 * @returns {string} - A string of only lowercase letters
 */
export function formatUserPrefs(str: string): string {
    return str.toLowerCase().replace(/[^a-z]/gi, '')
}

export interface FlatObject {
    [key: string]: any
}

/**
 * Flatten a multidimensional object
 *
 * For example:
 *   flattenObject{ a: 1, b: { c: 2 } }
 * Returns:
 *   { a: 1, c: 2}
 */
export const flattenObject = (obj: any) => {
    const flattened: FlatObject = {}

    Object.keys(obj).forEach((key) => {
        const value = obj[key]

        if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
        ) {
            Object.assign(flattened, flattenObject(value))
        } else {
            flattened[key] = value
        }
    })

    return flattened
}

//class LazyPromise<T> extends Promise<T> {
//    private _executor: (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void
//    /** @param {ConstructorParameters<PromiseConstructor>[0]} executor */
//    constructor(executor: ConstructorParameters<PromiseConstructor>[0]) {
//        super(executor)
//        if (typeof executor !== 'function') {
//            throw new TypeError(`LazyPromise executor is not a function`)
//        }
//        this._executor = executor
//    }
//    then() {
//        this.promise = this.promise || new Promise(this._executor)
//        return this.promise.then.apply(this.promise, arguments)
//    }
//}
export function memoize<R, T extends (...args: any[]) => R>(f: T): T {
    const memory = new Map<string, R>()

    const g = (...args: any[]) => {
        if (!memory.get(args.join())) {
            memory.set(args.join(), f(...args))
        }

        return memory.get(args.join())
    }

    return g as T
}

export interface hslType {
    hue: number
    saturation: number
    lightness: number
}
export class hsl implements hslType {
    hue: number
    saturation: number
    lightness: number
    constructor(hue: number, saturation: number, lightness: number) {
        this.hue = hue
        this.saturation = saturation
        this.lightness = lightness
    }
    toString() {
        return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`
    }
}

export function setToRange(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max)
}
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 360], [0, 100], and [0, 100],
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
export function rgbToHsl(r: number, g: number, b: number): Array<any> {
    ;(r /= 255), (g /= 255), (b /= 255)

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b)
    var h,
        s,
        l = (max + min) / 2

    if (max == min) {
        h = s = 0 // achromatic
    } else {
        var d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
            default:
                h = 0
                break
        }

        h /= 6
    }

    return [h * 360, s * 100, l * 100]
}

export function convertRemToPixels(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}
/**
 * @description Converts a number to a string with a given number of digits after the decimal point
 * @param {number} val - A number to be converted
 * @param {number} digits - A number of digits after the decimal point
 * @returns {number} - A string with a given number of digits after the decimal point
 */
export const numToFixed = (val: number, digits: number): number =>
    Math.round(val * 10 ** digits) / 10 ** digits
