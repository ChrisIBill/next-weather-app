import { useState } from "react";
import { GoogleMapsAPIKey } from "../Private/APIKeys";
//import "./testData";
type Coords = [number, number] | undefined;
type locType = "Zip Code" | "City" | "Coordinates";

//const apiSrc = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${GoogleMapsAPIKey}`;
const apiSrc = `testData.json`;

function successCallback(result: any) {
	console.log("Success");
	console.log(result);
}
function errorCallback(result: any) {
	console.log("Fail");
	console.log(result);
}
export const getGeolocation = new Promise((resolve, reject) => {
	const usrCoords: any[] = [];

	function success(pos: GeolocationPosition) {
		const crd = pos.coords;

		console.log("Your current position is:");
		console.log(`Latitude : ${crd.latitude}`);
		console.log(`Longitude: ${crd.longitude}`);
		console.log(`More or less ${crd.accuracy} meters.`);
		usrCoords.push(crd.latitude, crd.longitude);
		resolve(usrCoords);
	}

	function error(err: GeolocationPositionError) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		reject("User denied");
	}

	if ("geolocation" in navigator) {
		console.log("Location Available");
	} else {
		console.log("Location Not Available");
		reject("Location Not Available");
	}
	const options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	};
	navigator.geolocation.getCurrentPosition(success, error, options);
	console.log("Usr coords: " + typeof usrCoords);
	if (usrCoords) return usrCoords;
});

export const getGeocode = async (loc?: any) => {
	const usrCoords: [any, any] = ["", ""];
	let apiCallError = null;
	let isLoaded = false;
	usrCoords.pop();
	usrCoords.pop();

	return await fetch(apiSrc)
		.then((res) => res.json())
		.then(
			(result) => {
				isLoaded = true;
				usrCoords.push(result.results[0].geometry.location.lat, result.results[0].geometry.location.lng);
				console.log(usrCoords);
				console.log("Google Lat translation" + usrCoords[0]);
				console.log("Google Lat translation" + usrCoords[1]);
				return usrCoords;
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.log(error);
				isLoaded = true;
				apiCallError = error;
				return;
			}
		);
};
export async function getCoords(loc?: string) {
	console.log("getCoords Loc: " + loc);
	return Promise.any([getGeocode(loc), getGeolocation]).then((value) => console.log("Value: " + value));
}
