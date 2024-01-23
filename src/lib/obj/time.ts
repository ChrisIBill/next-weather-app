import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import logger from '../pinoLogger'

const TimeLogger = logger.child({ module: 'Time Class' })

export const UNIX_HOURS_OF_DAY = [
    0, 3600, 7200, 10800, 14400, 18000, 21600, 25200, 28800, 32400, 36000,
    39600, 43200, 46800, 50400, 54000, 57600, 61200, 64800, 68400, 72000, 75600,
    79200, 82800,
] as const
export const DEFAULT_HOUR_DATA = [
    {
        _timePercent: 0.5,
        _isDay: false,
        _clockString: '12:00 AM',
        _timeOfDay: 'night',
    },
    {
        _timePercent: 0.5833333333333334,
        _isDay: false,
        _clockString: '1:00 AM',
        _timeOfDay: 'night',
    },
    {
        _timePercent: 0.6666666666666666,
        _isDay: false,
        _clockString: '2:00 AM',
        _timeOfDay: 'night',
    },
    {
        _timePercent: 0.75,
        _isDay: false,
        _clockString: '3:00 AM',
        _timeOfDay: 'night',
    },
    {
        _timePercent: 0.8333333333333334,
        _isDay: false,
        _clockString: '4:00 AM',
        _timeOfDay: 'night',
    },
    {
        _timePercent: 0.9166666666666666,
        _isDay: false,
        _clockString: '5:00 AM',
        _timeOfDay: 'morning',
    },
    {
        _timePercent: 0,
        _isDay: true,
        _clockString: '6:00 AM',
        _timeOfDay: 'morning',
    },
    {
        _timePercent: 0.08333333333333333,
        _isDay: true,
        _clockString: '7:00 AM',
        _timeOfDay: 'morning',
    },
    {
        _timePercent: 0.16666666666666666,
        _isDay: true,
        _clockString: '8:00 AM',
        _timeOfDay: 'morning',
    },
    {
        _timePercent: 0.25,
        _isDay: true,
        _clockString: '9:00 AM',
        _timeOfDay: 'morning',
    },
    {
        _timePercent: 0.3333333333333333,
        _isDay: true,
        _clockString: '10:00 AM',
        _timeOfDay: 'day',
    },
    {
        _timePercent: 0.4166666666666667,
        _isDay: true,
        _clockString: '11:00 AM',
        _timeOfDay: 'day',
    },
    {
        _timePercent: 0.5,
        _isDay: true,
        _clockString: '12:00 PM',
        _timeOfDay: 'day',
    },
    {
        _timePercent: 0.5833333333333334,
        _isDay: true,
        _clockString: '1:00 PM',
        _timeOfDay: 'day',
    },
    {
        _timePercent: 0.6666666666666666,
        _isDay: true,
        _clockString: '2:00 PM',
        _timeOfDay: 'day',
    },
    {
        _timePercent: 0.75,
        _isDay: true,
        _clockString: '3:00 PM',
        _timeOfDay: 'day',
    },
    {
        _timePercent: 0.8333333333333334,
        _isDay: true,
        _clockString: '4:00 PM',
        _timeOfDay: 'day',
    },
    {
        _timePercent: 0.9166666666666666,
        _isDay: true,
        _clockString: '5:00 PM',
        _timeOfDay: 'evening',
    },
    {
        _timePercent: 0,
        _isDay: false,
        _clockString: '6:00 PM',
        _timeOfDay: 'evening',
    },
    {
        _timePercent: 0.08333333333333333,
        _isDay: false,
        _clockString: '7:00 PM',
        _timeOfDay: 'evening',
    },
    {
        _timePercent: 0.16666666666666666,
        _isDay: false,
        _clockString: '8:00 PM',
        _timeOfDay: 'evening',
    },
    {
        _timePercent: 0.25,
        _isDay: false,
        _clockString: '9:00 PM',
        _timeOfDay: 'evening',
    },
    {
        _timePercent: 0.3333333333333333,
        _isDay: false,
        _clockString: '10:00 PM',
        _timeOfDay: 'night',
    },
    {
        _timePercent: 0.4166666666666667,
        _isDay: false,
        _clockString: '11:00 PM',
        _timeOfDay: 'night',
    },
] as const
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
    dateObj: dayjs.Dayjs
    getIsDay?: () => boolean
    getTimePercent?: () => number
    getTimeOfDay?: () => TimeOfDayType
}

export interface DayTimeClassType extends TimeClassType {
    hours: HourTimeClass[]
    current?: HourTimeClass
}

export default class DayTimeClass implements DayTimeClassType {
    value: number
    sunrise: number
    sunset: number
    dateObj: dayjs.Dayjs
    current?: HourTimeClass
    hours: HourTimeClass[]
    constructor(value: number, sunrise?: number, sunset?: number) {
        this.value = value //Start of day so 12:00 AM
        this.dateObj = dayjs.unix(value)
        this.sunrise = sunrise ?? value + 21600 //6:00 AM
        this.sunset = sunset ?? value + 64800 //6:00 PM
        this.hours = this.constructHours()
        TimeLogger.debug(
            {
                value: this.value,
                sunrise: this.sunrise,
                sunset: this.sunset,
                dateObj: this.dateObj,
            },
            'DayTimeClass dateObj'
        )
    }
    constructHours = () => {
        return UNIX_HOURS_OF_DAY.map((hour) => {
            return new HourTimeClass(
                hour,
                this.sunrise - this.value,
                this.sunset - this.value,
                this
            )
        })
    }

    createCurrent(value: number) {
        this.current = new HourTimeClass(
            value - this.value,
            this.sunrise - this.value,
            this.sunset - this.value,
            this
        )
        return this.current
    }

    private generateDayjsObj() {
        //TODO: Depending on situation, this may or may not be recoverable
        // Testing needed
        try {
            this.dateObj = dayjs.unix(this.value)
            if (this.dateObj.isValid()) return this.dateObj
            else throw new Error('Invalid dayjs object')
        } catch (e) {
            TimeLogger.error(
                `${e} \n
                Ocucred generating dayjs object for DayTimeClass: ${this} \n
                From value: ${this.value}`
            )
            throw e
        }
    }

    _calcTimePercents = () => {
        TimeLogger.debug('Calculating time percents for DayTimeClass: ')
        try {
            const [sunrise, sunset] = [
                this.sunrise - this.value,
                this.sunset - this.value,
                this.current ? this.current.value : undefined,
            ]
            const [dayLength, nightLength] = [
                sunset - sunrise,
                sunrise + 86400 - sunset,
            ]
            const times = this.current
                ? [...this.hours, this.current]
                : this.hours
            times.forEach((hour, index) => {
                if (hour.value === undefined)
                    throw new Error(
                        `Hour value is undefined for hour ${index} on day: ${this}`
                    )
                if (hour.value < sunrise) {
                    hour._timePercent =
                        (hour.value + 86400 - sunset) / nightLength
                    hour._isDay = false
                } else if (hour.value < sunset) {
                    hour._timePercent = (hour.value - sunrise) / dayLength
                    hour._isDay = true
                } else if (hour.value <= 86400) {
                    hour._timePercent = (hour.value - sunset) / nightLength
                    hour._isDay = false
                } else
                    throw new Error(
                        `Hour value ${hour.value} is out of range for index ${index} on day: ${this}`
                    )
            })
            return true
        } catch (e) {
            TimeLogger.error(
                { error: e, day: this },
                `while calculating time percents for DayTimeClass: `
            )
            this.hours.forEach((hour, index) => {
                const hourDefaults = DEFAULT_HOUR_DATA[index]
                hour._timePercent = hourDefaults._timePercent
                hour._isDay = hourDefaults._isDay
                hour._timeOfDay = hourDefaults._timeOfDay
            })
            return false
        }
    }
}

export interface HourTimeClassType extends TimeClassType {
    day: DayTimeClass
    getIsDay: () => boolean
    getTimePercent: () => number
    getTimeOfDay: () => TimeOfDayType
}

export class HourTimeClass implements HourTimeClassType {
    value: number
    sunrise: number
    sunset: number
    dateObj: dayjs.Dayjs
    day: DayTimeClass
    _timePercent?: number
    _isDay?: boolean
    _timeOfDay: (() => TimeOfDayType) | TimeOfDayType
    constructor(
        value: number,
        sunrise: number,
        sunset: number,
        day: DayTimeClass
    ) {
        this.value = value
        this.dateObj = dayjs.unix(value + day.value)
        this.sunrise = sunrise
        this.sunset = sunset
        this.day = day
        this._isDay = undefined
        this._timePercent = undefined
        this._timeOfDay = this.calcTimeOfDay
        TimeLogger.debug(
            {
                value: this.value,
                sunrise: this.sunrise,
                sunset: this.sunset,
                dateObj: this.dateObj,
            },
            'HourTimeClass dateObj'
        )
    }
    getIsDay = () => {
        if (typeof this._isDay === 'undefined') {
            this.day._calcTimePercents()
            if (typeof this._isDay !== 'boolean')
                throw new Error('isDay is still undefined')
            else return this._isDay
        } else return this._isDay
    }
    getTimePercent = () => {
        if (typeof this._timePercent === 'undefined') {
            this.day._calcTimePercents()
            if (typeof this._timePercent !== 'number')
                throw new Error('timePercent is still undefined')
            else return this._timePercent
        } else return this._timePercent
    }

    getTimeOfDay = () => {
        return typeof this._timeOfDay === 'string'
            ? this._timeOfDay
            : this._timeOfDay()
    }
    private calcTimeOfDay = () => {
        try {
            const timePercent = this.getTimePercent()
            const isDay = this.getIsDay()
            switch (isDay) {
                case true: {
                    if (timePercent < 0.2) return 'morning'
                    else if (timePercent < 0.8) return 'day'
                    else return 'evening'
                }
                case false: {
                    if (timePercent < 0.2) return 'evening'
                    else if (timePercent < 0.8) return 'night'
                    else return 'morning'
                }
                default: {
                    return 'night'
                }
            }
        } catch (e) {
            TimeLogger.error(
                { error: e, hour: this },
                `Error calculating time of day for HourTimeClass: `
            )
            return 'night'
        }
    }
}

export function getTimeClassType(time: TimeClassType): TimeType | undefined {
    if (time instanceof DayTimeClass) return 'day'
    else if (time instanceof HourTimeClass) return 'hour'
    else {
        TimeLogger.error(
            { time },
            'Error getting time class type, returning undefined'
        )
        return undefined
    }
}
