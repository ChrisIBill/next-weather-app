import {
    CurrentWeatherData,
    DailyWeatherDataType,
    DayWeatherData,
} from "../lib/interfaces";

export default function sanitizeWeatherData(weatherData: any) {}

function convertTempsToString(x: number | undefined) {
    return Math.trunc(x || Infinity) + "°";
}
const getAvgTemp = (...temps: (number | undefined)[]) => {
    const len = temps.length;
    const initialValue = 0;
    const addedTemp: number | undefined = temps.reduce(
        (a, b) => (a ? a : 0) + (b ? b : 0),
        initialValue
    );
    if (addedTemp) return addedTemp / 4;
    else return undefined;
};
const getImageSrc = (str: string | undefined) => {
    switch (str) {
        case "Thunderstorm":
            return "/weather-images/id2xx.jpg";
        case "Drizzle":
            return "/weather-images/id3xx-5xx.jpg";
        case "Rain":
            return "/weather-images/id3xx-5xx.jpg";
        case "Snow":
            return "/weather-images/id6xx.jpg";
        case "Clear":
            return "/weather-images/id800.jpg";
        case "Clouds":
            return "/weather-images/id80x.jpg";
        default:
            return "/weather-images/errImg.jpg";
    }
};
function convertTimeToDay(dt: number) {}
export function sanitizeDailyWeatherData(
    weatherData: DailyWeatherDataType[]
): DayWeatherData[] {
    const weekData: DayWeatherData[] = [];
    const weekObj = {};
    weatherData.forEach((elem, index) => {
        const temp = elem.temp;
        const temps = [temp.morn, temp.day, temp.eve, temp.night];
        const feels = elem.feels_like;
        const weather = elem.weather;
        const avgTemp = getAvgTemp(...temps);
        weekData.push({
            dt: elem.dt,
            data: {
                temps: {
                    high: "" + convertTempsToString(temp.max),
                    low: "" + convertTempsToString(temp.min),
                    avg: "" + convertTempsToString(avgTemp),
                    morn: [
                        "" + convertTempsToString(temp.morn),
                        "" + convertTempsToString(feels.morn),
                    ],
                    day: [
                        "" + convertTempsToString(temp.day),
                        "" + convertTempsToString(feels.day),
                    ],
                    eve: [
                        "" + convertTempsToString(temp.eve),
                        "" + convertTempsToString(feels.eve),
                    ],
                    night: [
                        "" + convertTempsToString(temp.night),
                        "" + convertTempsToString(feels.night),
                    ],
                },
                misc: {
                    pressure: "" + elem.pressure,
                    humidity: "" + elem.humidity,
                    dew_point: "" + elem.dew_point,
                    wind_speed: "" + elem.wind_speed,
                    wind_deg: "" + elem.wind_deg,
                    wind_gust: "" + elem.wind_gust,
                    clouds: "" + elem.clouds,
                    pop: "" + elem.pop,
                    rain: "" + elem.rain,
                    snow: "" + elem.snow,
                    uvi: "" + elem.uvi,
                },
                weather: {
                    id: "" + elem.weather?.[0].id,
                    main: "" + elem.weather?.[0].main,
                    description: "" + elem.weather?.[0].id,
                    img_src: "" + getImageSrc(elem.weather?.[0].main),
                },
            },
        });
    });
    return weekData;
}
export {};
