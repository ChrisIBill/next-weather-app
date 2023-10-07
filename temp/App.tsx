import React from "react";
import "./App.css";
import { createContext, SetStateAction, useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, CssBaseline } from "@mui/material";
import siteTheme from "./lib/siteTheme";
import UserLocationPanel from "./Components/UserLocationPanel";
import { getGeolocation } from "./Components/geolocator";
import { DailyWeatherReports } from "./Components/weatherReports";
import {
	AreaChartDataType,
	AreaChartHandlerProps,
	DayWeatherData,
	HourlyWeatherDataType,
	WeatherDataType,
} from "./lib/interfaces";
import { Pending } from "@mui/icons-material";
//const WeatherAPIsrc = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API key}&units=${/* Metric or Imperial */}`;
const WeatherAPISrc = `FarTestWeatherData.json`;
type Coords = [number, number];
interface User {
	id?: string | undefined;
	loc?: Coords;
}

const LoadingScreen = () => {
	return <Pending />;
};
function App() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasLocation, setHasLocation] = useState(false);
	const [userCoords, setUserCoords] = useState<Coords>();
	const [userWeather, setUserWeather] = useState<WeatherDataType>();
	const [weeklyUserWeather, setWeeklyUserWeather] = useState<DayWeatherData[]>();

	//Async User Location Data Request
	const resolveCallback = (result: any) => {
		setUserCoords(result);
		setHasLocation(true);
	};
	const failCallback = (error: any) => {
		console.log("getGeolocation Failed");
		console.log(error.message);
	};
	function asyncUserLocation() {
		console.log("called async");
		getGeolocation.then(resolveCallback, failCallback);
	}
	asyncUserLocation();

	const handleManualCoords = (loc: any) => {
		setUserCoords(loc);
		setHasLocation(true);
		console.log("Setting Coords: " + loc);
	};
	const LocationHandler = () => {
		return (
			<Box>{hasLocation ? <></> : <UserLocationPanel submitCoords={handleManualCoords} isActive={!hasLocation} />}</Box>
		);
	};
	const GetOpenWeatherData = async (coords: Coords) => {
		fetch(WeatherAPISrc)
			.then((res) => res.json())
			.then(
				(result) => {
					console.log(result);
					setUserWeather(result);
				},
				(error) => {
					console.log(error.message);
					console.log("Error with fetching weather data");
				}
			);
	};
	/*     useEffect(() => {
        let ignore = false;
        console.log("Mounted");

        return () => {
            ignore = true;
            console.log("Unmounting");
        };
    }, []);
 */
	useEffect(() => {
		if (userCoords) {
			console.log("Getting weather data for coordinates: " + userCoords);
			GetOpenWeatherData(userCoords);
		}
	}, [userCoords]);
	/*  useEffect(() => {
        if (userWeather?.hourly) {
            //convertDataForReport(userWeather.hourly);
        }
        if (userWeather?.daily) {
            setWeeklyUserWeather(sanitizeDailyWeatherData(userWeather.daily));
        }
    }, [userWeather]); */
	useEffect(() => {
		console.log("Re-rendering");
		/* let ignore = false;
		if (!ignore) {
			userWeather ? DailyWeatherReports(userWeather.daily) : console.log("Error: unexpected weather data");
		} */
	}, [userWeather]);
	return (
		<ThemeProvider theme={siteTheme}>
			<Container id="App" component="main" disableGutters={true} maxWidth={false} sx={{ flexDirection: "column" }}>
				<CssBaseline enableColorScheme />
				<LocationHandler />
				{userWeather?.daily ? (
					<DailyWeatherReports WeatherData={userWeather.daily} hourlyWeatherData={userWeather.hourly} />
				) : (
					<LoadingScreen />
				)}
				{/* <Box sx={{ flexGrow: "1", height: "50%", width: 1 / 1 }}>
					{userWeather?.hourly ? <WeatherAreaChart weatherData={userWeather} /> : <LoadingScreen />}
				</Box> */}
			</Container>
		</ThemeProvider>
	);
}

export default App;
