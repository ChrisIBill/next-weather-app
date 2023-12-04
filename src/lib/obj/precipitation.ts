import { ForecastObjectType } from './forecastClass'

export const PRECIPIATION_UNIT_STRINGS = ['inch', 'mm'] as const
export const PRECIPITATION_TYPES = ['rain', 'snow', 'hail'] as const
export type PrecipitationUnitStrings =
    (typeof PRECIPIATION_UNIT_STRINGS)[number]
export type PrecipitationType = (typeof PRECIPITATION_TYPES)[number]

export interface PrecipitationClassType {
    value: number
    unit: () => PrecipitationUnitStrings
    userValue: () => number
    chance: number
    inch: number | (() => number)
    mm: number | (() => number)
    type: PrecipitationType
    getUserValue: () => () => number
    getMagnitude: () => number
    displayString: () => string
}

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
export default class PrecipitationClass implements PrecipitationClassType {
    value: number
    unit: () => PrecipitationUnitStrings
    userValue: () => number
    chance: number
    inch: number | (() => number)
    mm: number | (() => number)
    type: PrecipitationType

    //Since api returns rain, showers and snow amounts, as well as total precip,
    //we only need to check if snow is present to determine if it's snowing or raining
    constructor(
        chance: number,
        precip: number,
        snow: number,
        userUnit: () => PrecipitationUnitStrings
    ) {
        this.value = precip
        this.unit = userUnit
        this.userValue = this.getUserValue()
        this.chance = chance
        this.inch = () => this.convertToInch(precip)
        this.mm = precip
        this.type = snow > 0 ? 'snow' : 'rain'
    }
    [key: string]: string | number | Function | (() => number) | (() => string)

    //converts mm to inches
    convertToInch(precip: number): number {
        return precip * 0.0394
    }
    getUserValue(): () => number {
        return () => {
            if (this.unit() === 'inch') return this.convertToInch(this.value)
            else return this.value
        }
    }
    private getValueMagnitude(): number {
        return this.value <= 0
            ? 0
            : this.value < 1
            ? 1 //drizzle
            : this.value < 2.5
            ? 2 //light rain
            : this.value < 10
            ? 3 //moderate rain
            : this.value < 50
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
    getMagnitude(): number {
        return this.value > 0
            ? this.getValueMagnitude()
            : this.chance > 0
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

    displayString(): string {
        return this.value > 0
            ? `${this.getChanceString()} ${this.getValueString()}`
            : this.chance > 0
            ? `${this.getChanceString()} ${this.type}`
            : 'No rain'
    }
}
interface GenericIdentityFn {
    <Type>(arg: Type): Type
}

function identity<Type>(arg: Type): Type {
    return arg
}

let myIdentity: GenericIdentityFn = identity
const stuff = myIdentity(1)
const str = myIdentity('1')
