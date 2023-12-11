import { cloneElement } from 'react'
import { useUserPrefsStore } from '../stores'
import { ForecastObjectType } from './forecastClass'

export const PRECIPIATION_UNIT_STRINGS = ['inch', 'mm'] as const
export const PRECIPITATION_TYPES = ['rain', 'snow', 'hail'] as const
export type PrecipitationUnitStringsType =
    (typeof PRECIPIATION_UNIT_STRINGS)[number]
export type PrecipitationType = (typeof PRECIPITATION_TYPES)[number]

export const RAIN_VOLUME_STRINGS = [
    'none',
    'drizzle',
    'light rain',
    'moderate rain',
    'heavy rain',
    'torrential rain',
] as const
export const SNOW_VOLUME_STRINGS = [
    'none',
    'light snow',
    'moderate snow',
    'heavy snow',
    'blizzard',
] as const
export const RAIN_CHANCE_STRINGS = [
    'none',
    'slight chance of',
    'chance of',
    'likely',
    'very likely',
    'certain',
] as const

export const DEFAULT_PRECIPITATION_CLASS: PrecipitationClassType = {
    _mm: 0,
    chance: 0,
    _inch: 0,
    type: 'rain',
    _magnitude: 0,
    _displayString: 'No rain',
    convertToInch: () => 0,
    getUserValue: () => 0,
    getMagnitude: () => 0,
    getDisplayString: () => 'No rain',
}

export interface PrecipitationClassType {
    _mm: number
    chance: number
    _inch: number | (() => number)
    type: PrecipitationType
    _magnitude: (() => number) | number
    _displayString: (() => string) | string
    convertToInch: () => number
    getUserValue: () => number
    getMagnitude: () => number
    getDisplayString: () => string
}

export default class PrecipitationClass implements PrecipitationClassType {
    _mm: number
    chance: number
    _inch: number | (() => number)
    type: PrecipitationType
    _magnitude: (() => number) | number
    _displayString: (() => string) | string

    //Since api returns rain, showers and snow amounts, as well as total precip,
    //we only need to check if snow is present to determine if it's snowing or raining
    constructor(chance: number, precip: number, snow: number) {
        this._mm = precip
        this.chance = chance
        this._inch = () => this.convertToInch()
        this.type = snow > 0 ? 'snow' : 'rain'
        this._magnitude = this.generateMagnitude
        this._displayString = this.calcDisplayString
    }

    //converts mm to inches
    convertToInch(): number {
        this._inch = this._mm * 0.0394
        return this._inch
    }
    getUserValue() {
        const userUnit = useUserPrefsStore.getState().precipitationUnit
        return userUnit === 'inch'
            ? typeof this._inch === 'function'
                ? this._inch()
                : this._inch
            : this._mm
    }
    getDisplayString(): string {
        return typeof this._displayString === 'function'
            ? this._displayString()
            : this._displayString
    }
    getMagnitude(): number {
        return typeof this._magnitude === 'function'
            ? this._magnitude()
            : this._magnitude
    }

    private getValueMagnitude(): number {
        return this._mm <= 0
            ? 0
            : this._mm < 1
            ? 1 //drizzle
            : this._mm < 2.5
            ? 2 //light rain
            : this._mm < 10
            ? 3 //moderate rain
            : this._mm < 50
            ? 4 //heavy rain
            : 5 //torrential rain
    }
    private getChanceMagnitude(): number {
        return this.chance <= 0
            ? 0
            : this.chance < 25
            ? 1
            : this.chance < 50
            ? 2
            : this.chance < 75
            ? 3
            : this.chance < 100
            ? 4
            : 5
    }
    private generateMagnitude(): number {
        return this._mm > 0
            ? this.getValueMagnitude()
            : this._mm > 0
            ? this.getChanceMagnitude()
            : 0
    }
    private getValueString(): string {
        return this.type === 'rain'
            ? `${RAIN_VOLUME_STRINGS[this.getValueMagnitude()]}`
            : `${SNOW_VOLUME_STRINGS[this.getValueMagnitude()]}`
    }
    private getChanceString(): string {
        return `${this.chance}% chance of`
    }

    private calcDisplayString(): string {
        return this._mm > 0
            ? `${this.getChanceString()} ${this.getValueString()}`
            : this.chance > 0
            ? `${this.getChanceString()} ${this.type}`
            : 'No rain'
    }
}

export interface PrecipitationComponentWrapperProps {
    children: React.ReactNode
}

export const PrecipitationComponentWrapper: React.FC<
    PrecipitationComponentWrapperProps
> = (props: PrecipitationComponentWrapperProps): JSX.Element => {
    const userUnit = useUserPrefsStore((state) => state.precipitationUnit)
    return cloneElement(props.children as React.ReactElement, { userUnit })
}
