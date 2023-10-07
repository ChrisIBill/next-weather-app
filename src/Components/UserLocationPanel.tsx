import {
	Backdrop,
	Divider,
	FormControl,
	FormGroup,
	Input,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import { getCoords, getGeocode, getGeolocation } from "./geolocator";
//import Geolocator from "./geolocator";
/* interface ChildProps {
    onEnterKey: (e: {    keyCode: number;}, loc: any) => void
    isActive: boolean;
} */

type Coords = [number, number] | undefined;
const LOCATION_TYPES = ["Zip Code", "City", "Coordinates"];
type locType = (typeof LOCATION_TYPES)[number]; //"Zip Code" | "City" | "Coordinates";
/* const UserLocationPanel = ({
	onEnterKey,
	value,
	isActive,
}: {
	onEnterKey: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	value: coords;
	isActive: boolean;
    }) => { */

const inputStyle: CSSProperties = {
	boxSizing: `border-box`,
	border: `1px solid transparent`,
	width: `240px`,
	height: `32px`,
	padding: `0 12px`,
	borderRadius: `3px`,
	boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
	fontSize: `14px`,
	outline: `none`,
	textOverflow: `ellipses`,
	position: "absolute",
	top: "10px",
	right: "10px",
};

const UserLocationPanel = ({ submitCoords, isActive }: { submitCoords: any; isActive: boolean }) => {
	const [isOpen, setIsOpen] = useState(true);
	const [addressType, setAddressType] = useState<locType>("Zip Code");
	const [userAddress, setUserAddress] = useState<string>("");
	const [zipCode, setZipCode] = useState<string>("75230");
	const [city, setCity] = useState<string>("");
	const [isInputError, setIsInputError] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [helperText, setHelperText] = useState<string>("");

	const zipCodeRegEx = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/;
	const handleEnterKey = async (e: { keyCode: number }) => {
		if (e.keyCode == 13) {
			if (zipCodeRegEx.test(zipCode)) {
				console.log("Enter key pressed");
				setIsInputError(false);
				getGeocode(zipCode).then((value) => submitCoords(value));
				//setIsValid(true);
			} else {
				setHelperText("Please enter a valid 5 digit US Zip Code");
				setIsInputError(true);
			}
		}
	};

	const handleChange = (e: any) => {
		const regex = /^[0-9\b]+$/;
		console.log(e.keycode);
		if (e.target.value === "" || regex.test(e.target.value)) {
			setZipCode(e.target.value);
			setIsInputError(false);
			setHelperText("");
		} else {
			setIsInputError(true);
			setHelperText("Please enter numbers only");
		}
	};

	const resolveGeoCallback = (result: any) => {
		return submitCoords(result);
	};
	const failGeoCallback = (error: any) => {
		console.log("getGeolocation Failed");
		console.log(error.message);
	};
	/*
TODO:
     * useEffect(async () => {
		const p = await getGeolocation.then(resolveGeoCallback, failGeoCallback);
		const { promise, cancel } = cancellablePromise(p);
		promise.then((d: any) => {
			console.log("Promise resolved");
			console.log(d);
			submitCoords(d);
		});
		const clear = async () => {
			await cancel();
		};
		clear();
	}, []); */

	return (
		<Backdrop
			//onSubmit={handleEnterKey}
			sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
			open={isActive}
		>
			<Container maxWidth="sm">
				<Paper elevation={24} sx={{ pt: 2 }}>
					<Typography variant="h5" align="center">
						Location Data Needed
					</Typography>
					<Divider />
					<Typography align="center">Please enable location services</Typography>
					<br />
					<Typography align="center">Or search by locattion</Typography>
					<br />
					<FormGroup row={true} sx={{ alignItems: "center", justifyContent: "center" }}>
						<Typography align="center" sx={{ width: 1 / 3 }}>
							Enter your
						</Typography>
						<FormControl sx={{ width: 1 / 3 }} size="small">
							<InputLabel>{addressType}</InputLabel>
							<Select
								value={addressType}
								onChange={(event: SelectChangeEvent) => {
									setAddressType(event.target.value);
								}}
							>
								<MenuItem value={"City"}>City</MenuItem>
								<MenuItem value={"Zip Code"}>Zip Code</MenuItem>
								{/* <MenuItem value={"Address"}>Address</MenuItem> */}
							</Select>
						</FormControl>
						<br />
						<TextField
							id="zipcode-input"
							label="Zip Code"
							variant="outlined"
							size="small"
							inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
							onChange={(e) => handleChange(e)}
							onKeyDown={(e) => handleEnterKey(e)}
							value={zipCode}
							error={isInputError}
							helperText={helperText}
						/>
					</FormGroup>
					{/* <AppBar>Location Data Needed</AppBar> */}
				</Paper>
			</Container>
		</Backdrop>
	);
};

export default UserLocationPanel;
