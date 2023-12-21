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
    3: { short: 'Overcast', long: 'Overcast' }, //1
    45: { short: 'Fog', long: 'Fog' },
    48: { short: 'Rime Fog', long: 'Rime Fog' },
    51: { short: 'Drizzle', long: 'Light Drizzle' }, //1
    53: { short: 'Drizzle', long: 'Drizzle' }, //1
    55: { short: 'Drizzle', long: 'Heavy Drizzle' }, //2
    56: { short: 'Freezing Drizzle', long: 'Freezing Drizzle' }, //2
    57: { short: 'Freezing Drizzle', long: 'Heavy Freezing Drizzle' }, //3
    61: { short: 'Rain', long: 'Light Rain' }, //3
    63: { short: 'Rain', long: 'Moderate Rain' }, //3
    65: { short: 'Rain', long: 'Heavy Rain' }, //4
    66: { short: 'Freezing Rain', long: 'Freezing Rain' }, //3
    67: { short: 'Freezing Rain', long: 'Heavy Freezing Rain' }, //4
    71: { short: 'Snow', long: 'Light Snow' }, //
    73: { short: 'Snow', long: 'Moderate Snow' }, //gray
    75: { short: 'Snow', long: 'Heavy Snow' }, //light dark gray
    77: { short: 'Snow', long: 'Snow Grains' }, //dark gray
    80: { short: 'Downpour', long: 'Downpour' }, //dark gray
    81: { short: 'Downpour', long: 'Heavy Downpour' }, //dark gray
    82: { short: 'Downpour', long: 'Torrential Rain' }, //dark dark gray
    85: { short: 'Blizzard', long: 'Blizzard' }, //dark gray
    86: { short: 'Blizzard', long: 'Heavy Blizzard' }, //dark gray
    95: { short: 'Thunder', long: 'Thunderstorm' }, //dark dark gray
    96: { short: 'Hailstorm', long: 'Thunderstorm w/ Hail' }, //dark dark gray
}
