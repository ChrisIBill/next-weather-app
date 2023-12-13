export interface CloudClassType {
    cloudCover: number
    getDisplayString: () => string
    getCloudColor: () => string
}

export const CLOUD_COVER_STRINGS = [
    'Clear',
    'Mostly Clear',
    'Partly Cloudy',
    'Mostly Cloudy',
    'Overcast',
]

function getCloudCoverMagnitude(cloudCover: number) {
    if (cloudCover < 10) return 0
    if (cloudCover < 35) return 1
    if (cloudCover < 65) return 2
    if (cloudCover < 90) return 3
    return 4
}

function getCloudDisplayString(cloudCover: number) {
    if (cloudCover < 10) return 'Clear'
    if (cloudCover < 35) return 'Mostly Clear'
    if (cloudCover < 65) return 'Partly Cloudy'
    if (cloudCover < 90) return 'Mostly Cloudy'
    return 'Overcast'
}

export interface hslType {
    hue: number
    saturation: number
    lightness: number
}

export const CLOUD_COLOR_MAP = [0, 50, 60, 70, 80, 90]
export function getCloudColor(weatherCode: number): hslType {
    if (weatherCode < 50 && weatherCode != 3) {
        return { hue: 0, saturation: 0, lightness: 99 }
    } else if (weatherCode < 60 || weatherCode === 71) {
        return { hue: 0, saturation: 0, lightness: 85 }
    } else if (weatherCode < 70 || weatherCode === 73) {
        return { hue: 0, saturation: 0, lightness: 70 }
    } else if (weatherCode < 80) {
        return { hue: 0, saturation: 0, lightness: 60 }
    } else if (weatherCode < 90) {
        return { hue: 0, saturation: 0, lightness: 45 }
    } else if (weatherCode < 100) {
        return { hue: 0, saturation: 0, lightness: 30 }
    } else {
        return { hue: 0, saturation: 0, lightness: 99 }
    }
}

export class CloudClass implements CloudClassType {
    cloudCover: number
    getCloudColor: () => string
    getDisplayString: () => string
    constructor(cloudCover: number, weatherCode: number) {
        this.cloudCover = cloudCover
        this.getCloudColor = () => getCloudColor(weatherCode)
        this.getDisplayString = () =>
            CLOUD_COVER_STRINGS[getCloudCoverMagnitude(cloudCover)]
    }
}
