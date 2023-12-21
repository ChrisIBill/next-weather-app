//Time
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

// Wind Constants
export const CARDINAL_DIRECTIONS = [
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
export const BEAUFORT_SPEEDS = [
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
export const BEAUFORT_SCALE = [
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
        description: 'breeze',
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
