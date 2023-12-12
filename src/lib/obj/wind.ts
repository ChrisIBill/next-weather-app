import { memoize } from 'lodash'

export const WIND_UNIT_STRINGS = ['ms', 'kph', 'mph', 'kn'] as const
export type WindUnitStringsType = (typeof WIND_UNIT_STRINGS)[number]

const CARDINAL_DIRECTIONS = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
] as const
const BEAUFORT_SPEEDS = [
    2,
    5,
    11,
    19,
    28,
    38,
    49,
    61,
    74,
    88,
    102,
    117,
    Infinity,
] as const
const BEAUFORT_SCALE = [
    {
        speed: 2,
        description: 'calm',
    },
    {
        speed: 5,
        description: 'light air',
    },
    {
        speed: 11,
        description: 'light breeze',
    },
    {
        speed: 19,
        description: 'gentle breeze',
    },
    {
        speed: 28,
        description: 'moderate breeze',
    },
    {
        speed: 38,
        description: 'fresh breeze',
    },
    {
        speed: 49,
        description: 'strong breeze',
    },
    {
        speed: 61,
        description: 'high wind',
    },
    {
        speed: 74,
        description: 'gale',
    },
    {
        speed: 88,
        description: 'strong gale',
    },
    {
        speed: 102,
        description: 'storm',
    },
    {
        speed: 117,
        description: 'violent storm',
    },
    {
        speed: Infinity,
        description: 'hurricane',
    },
] as const

export type BeaufortScaleType = (typeof BEAUFORT_SCALE)[number]

export interface WindClassType {
    _kph: number[]
    _mph: () => number[]
    _ms: () => number[]
    _kn: () => number[]
    _degrees: number
    _beaufort: () => number[]
    getSpeed: () => number
    getGustSpeed: () => number
    getCardinalDirection: () => string
    getDescription: () => string
    getGustDescription: () => string
}

export interface WindUnitConversionFns {
    kphToMph: (speed: number) => number
    kphToMs: (speed: number) => number
    kphToKn: (speed: number) => number
}

export const kphToMph = (speed: number) => {
    console.log('MemoLog: kphToMph called')
    return speed * 0.621371
}
export const kphToMs = (speed: number) => speed * 0.277778
export const kphToKn = (speed: number) => speed * 0.539957
export const kphToBeaufort = (speed: number) => {
    const index = BEAUFORT_SPEEDS.findIndex((val) => {
        return speed < val
    })
    return index === -1 ? 0 : index
}
export const memoizedKphToMph = memoize(kphToMph)
export const memoizedKphToMs = memoize(kphToMs)
export const memoizedKphToKn = memoize(kphToKn)
export const memoizedKphToBeaufort = memoize(kphToBeaufort)

export default class WindClass implements WindClassType {
    _kph: number[]
    _mph: () => number[]
    _ms: () => number[]
    _kn: () => number[]
    _degrees: number
    _beaufort: () => number[]
    constructor(speeds: [number?, number?], direction: number | undefined) {
        this._kph = speeds.map((val, i) => {
            if (val === undefined) {
                console.error(
                    `Wind speed ${i} is undefined in Wind constructor: `,
                    this
                )
                return 0
            }
            return val
        })
        this._mph = () => this._kph.map((val) => memoizedKphToMph(val))
        this._ms = () => this._kph.map((val) => memoizedKphToMs(val))
        this._kn = () => this._kph.map((val) => memoizedKphToKn(val))
        this._degrees = direction ?? NaN
        this._beaufort = () =>
            this._kph.map((val) => memoizedKphToBeaufort(val))
    }
    getSpeed = (): number => {
        const userUnit = localStorage.getItem('windUnit')
        switch (userUnit) {
            case 'kph':
                return this._kph[0]
            case 'mph':
                return this._mph()[0]
            case 'ms':
                return this._ms()[0]
            case 'kn':
                return this._kn()[0]
            default:
                return this._kph[0]
        }
    }
    getGustSpeed = (): number => {
        const userUnit = localStorage.getItem('windUnit')
        switch (userUnit) {
            case 'kph':
                return this._kph[1]
            case 'mph':
                return this._mph()[1]
            case 'ms':
                return this._ms()[1]
            case 'kn':
                return this._kn()[1]
            default:
                return this._kph[1]
        }
    }
    getCardinalDirection = (): string => {
        const val = Math.floor(this._degrees / 22.5 + 0.5)
        return CARDINAL_DIRECTIONS[val % 16] ?? 'N/A'
    }

    getDescription = (): string => {
        return BEAUFORT_SCALE[this._beaufort()[0]].description
    }
    getGustDescription = (): string => {
        return BEAUFORT_SCALE[this._beaufort()[1]].description
    }
}
