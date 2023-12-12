import {
    HourlyForecastObjectType,
    StringLiteralType,
    StringLiteralUnion,
} from '../interfaces'

export interface ForecastObjectType<T> {
    value: number
    (unit: StringLiteralType<T>): StringLiteralType<T>
    [key: string]: number | (() => number) | string | (() => string) | Function
}
