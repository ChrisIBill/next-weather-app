export interface WeatherCodeMapType {
    [key: string]: {
        short: string
        long: string
    }
}
export const WeatherCodesMap: WeatherCodeMapType = {
    0: { short: 'Clear', long: 'Clear Sky' },
    1: { short: 'Few Clouds', long: 'Few Clouds' },
    2: { short: 'Cloudy', long: 'Partly Cloudy' },
    3: { short: 'Overcast', long: 'Overcast' },
    45: { short: 'Fog', long: 'Fog' },
    48: { short: 'Rime Fog', long: 'Rime Fog' },
    51: { short: 'Drizzle', long: 'Light Drizzle' },
    53: { short: 'Drizzle', long: 'Drizzle' },
    55: { short: 'Drizzle', long: 'Heavy Drizzle' },
    56: { short: 'Freezing Drizzle', long: 'Freezing Drizzle' },
    57: { short: 'Freezing Drizzle', long: 'Heavy Freezing Drizzle' },
    61: { short: 'Rain', long: 'Light Rain' },
    63: { short: 'Rain', long: 'Moderate Rain' },
    65: { short: 'Rain', long: 'Heavy Rain' },
    66: { short: 'Freezing Rain', long: 'Freezing Rain' },
    67: { short: 'Freezing Rain', long: 'Heavy Freezing Rain' },
    71: { short: 'Snow', long: 'Light Snow' },
    73: { short: 'Snow', long: 'Moderate Snow' },
    75: { short: 'Snow', long: 'Heavy Snow' },
    77: { short: 'Snow', long: 'Snow Grains' },
    80: { short: 'Downpour', long: 'Downpour' },
    81: { short: 'Downpour', long: 'Heavy Downpour' },
    82: { short: 'Downpour', long: 'Torrential Rain' },
    85: { short: 'Blizzard', long: 'Blizzard' },
    86: { short: 'Blizzard', long: 'Heavy Blizzard' },
    95: { short: 'Thunder', long: 'Thunderstorm' },
    96: { short: 'Hailstorm', long: 'Thunderstorm w/ Hail' },
}
