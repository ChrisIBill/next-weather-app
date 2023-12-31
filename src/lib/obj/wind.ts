import { memoize } from 'lodash'

import {
    BEAUFORT_SCALE,
    CARDINAL_DIRECTIONS,
    BEAUFORT_SPEEDS,
} from './constants'
import { cloneElement } from 'react'
import { WindUnitStringsType } from '../constants'

export type BeaufortScaleType = (typeof BEAUFORT_SCALE)[number]

export interface WindClassType {
    _kph: number[]
    _mph: () => number[]
    _ms: () => number[]
    _kn: () => number[]
    _degrees: number
    _beaufort: () => number[]
    getSpeed: () => string
    getGustSpeed: () => string
    getCardinalDirection: () => string
    getDescription: () => string
    getGustDescription: () => string
}

export const kphToMph = (speed: number) => {
    console.log('MemoLog: kphToMph called')
    return Math.round(speed * 0.621371)
}
export const kphToMs = (speed: number) => Math.round(speed * 0.277778)
export const kphToKn = (speed: number) => Math.round(speed * 0.539957)
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

export const convertToUserWindSpeed = (
    val: number,
    userUnit: WindUnitStringsType
) => {
    switch (userUnit) {
        case 'kph':
            return val
        case 'mph':
            return memoizedKphToMph(val)
        case 'ms':
            return memoizedKphToMs(val)
        case 'kn':
            return memoizedKphToKn(val)
        default:
            return val + ' kph'
    }
}

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
    getSpeed = (): string => {
        const userUnit = localStorage.getItem('windUnit')
        switch (userUnit) {
            case 'kph':
                return this._kph[0] + ' kph'
            case 'mph':
                return this._mph()[0] + ' mph'
            case 'ms':
                return this._ms()[0] + ' ms'
            case 'kn':
                return this._kn()[0] + ' kn'
            default:
                return this._kph[0] + ' kph'
        }
    }
    getGustSpeed = (): string => {
        const userUnit = localStorage.getItem('windUnit')
        switch (userUnit) {
            case 'kph':
                return this._kph[1] + ' kph'
            case 'mph':
                return this._mph()[1] + ' mph'
            case 'ms':
                return this._ms()[1] + ' ms'
            case 'kn':
                return this._kn()[1] + ' kn'
            default:
                return this._kph[1] + ' kph'
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

interface WindComponentWrapperProps {
    children: React.ReactNode
}

export const WindComponentWrapper: React.FC<WindComponentWrapperProps> = (
    props: WindComponentWrapperProps
): JSX.Element => {
    const userUnit = localStorage.getItem('precipitationUnit')
    return cloneElement(props.children as React.ReactElement, { userUnit })
}
