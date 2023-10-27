import { PosCoordinates } from './interfaces'

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

export function clockTimeToMinutes(time: string) {
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 60 + parseInt(minutes)
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
