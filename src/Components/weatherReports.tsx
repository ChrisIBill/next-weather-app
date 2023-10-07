import "./weatherReports.scss";
import "../styles.scss";

import {
	DailyWeatherDataType,
	DayTemperatures,
	HourlyWeatherDataType,
	ReportInfo,
	WeatherDataType,
	WeatherReportDataType,
} from "../lib/interfaces";

import { AspectRatio } from "@mui/icons-material";
import {
	Box,
	Container,
	Divider,
	Drawer,
	List,
	Pagination,
	PaginationItem,
	Paper,
	Skeleton,
	styled,
	Typography,
} from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2";
import { height } from "@mui/system";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { JsxElement } from "typescript";
import { sanitizeDailyWeatherData } from "./dataHandler";
import { ReportsPagination } from "./ReportsPagination";
import { ReportPanels } from "./ReportPanels";
import { weatherImgGenerator } from "../lib/lib";

interface DisplayInfoType {
	imageSrc: string;
	effects: string;
	backgroundMask: string;
}

const styles = {
	DailyReportContainer: {
		//minHeight: 300,
		backgroundSize: "cover",
		backgroundPositionY: "50%",
	},
};
const Root = styled("div")(({ theme }) => ({
	padding: theme.spacing(1),
	[theme.breakpoints.down("md")]: {
		backgroundColor: red[500],
	},
	[theme.breakpoints.up("md")]: {
		backgroundColor: blue[500],
	},
	[theme.breakpoints.up("lg")]: {
		backgroundColor: green[500],
	},
}));

const MakeWeatherReport = ({
	numDay,
	curWeatherData,
	hourlyWeatherData,
	dayWeatherData,
	displayInfo,
}: {
	numDay: number;
	curWeatherData: WeatherReportDataType;
	hourlyWeatherData?: HourlyWeatherDataType[];
	dayWeatherData: DailyWeatherDataType;
	displayInfo: DisplayInfoType;
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	let reportLabel, reportInfo;
	const HeaderDisplay = () => {
		const headerData = curWeatherData.dataset.shift();
		if (headerData == undefined) {
			reportLabel = "Error";
			reportInfo = "Undefined";
		} else {
			reportLabel = headerData.label;
			reportInfo = headerData.info;
		}
		return (
			<>
				<Typography className="reportTypography" variant="h3" align="center">
					{moment(curWeatherData.time, "X").format("dddd")}
				</Typography>
				<Typography className="reportTypography" variant="h4" align="center">
					{moment(curWeatherData.time, "X").format("MMM Do")}
				</Typography>
				<Typography className="reportTypography" variant="h5" align="center">
					{reportLabel} {reportInfo}
				</Typography>
			</>
		);
	};

	return (
		<Box className="dailyReportBox" style={{ flexGrow: "1", height: "100%" }}>
			<Paper
				className="dailyReport"
				style={{
					background: "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.3) 25.79%)",
					height: "100%",
					//filter: "blur(3px)",
				}}
				onClick={() => {
					console.log("click");
					setIsExpanded(!isExpanded);
				}}
				sx={[
					{
						"&:hover": {
							color: "red",
							backgroundColor: "white",
							margin: "0px",
						},
					},
				]}
			>
				<HeaderDisplay />
				<Divider />
				<ReportPanels curDaysWeatherData={dayWeatherData} hourlyWeatherData={hourlyWeatherData} numDay={numDay} />
				{/* {isExpanded ? (
                    <ul style={{ padding: "0", listStyle: "none" }}>
                        {ExtendedDisplay}
                    </ul>
                ) : undefined} */}
			</Paper>
			<Box
				className="dailyReportImage"
				style={{
					backgroundImage: `url(${displayInfo.imageSrc})`,
					height: "100%",
					backgroundSize: "cover",
				}}
			/>
		</Box>
	);
};

export const DailyWeatherReports = ({
	WeatherData,
	hourlyWeatherData,
}: {
	WeatherData: DailyWeatherDataType[];
	hourlyWeatherData: HourlyWeatherDataType[];
}) => {
	console.log("Generating Daily Reports");
	const displayInfoArr: DisplayInfoType[] = [];
	const [reportIndex, setReportIndex] = useState(1);
	const handleChange = (value: number) => {
		setReportIndex(value);
		console.log(value);
	};
	const weekData = sanitizeDailyWeatherData(WeatherData);

	const reportsData: WeatherReportDataType[] = WeatherData.map((elem, index) => {
		const date = elem.dt;
		const weatherCondition = elem.weather && elem.weather[0] ? elem.weather[0].main : undefined;
		if (elem.weather && elem.weather[0]) {
			displayInfoArr.push({
				imageSrc: weatherImgGenerator(weatherCondition),
				effects: "inset 0 0 0 1000px rgba(116, 160, 229, .3)",
				backgroundMask: "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.3) 25.79%)",
			});
		}
		const reportData: ReportInfo[] = [
			{
				label: "Temperature: ",
				info: `${elem.temp.day}`,
			},
			{
				label: "Weather: ",
				info: `${weatherCondition || "Error"}`,
			},
			{
				label: "Chance: ",
				info: `${elem.pop || "Error"}`,
			},
			{
				label: "Low: ",
				info: `${elem.temp.min}`,
			},
			{
				label: "High: ",
				info: `${elem.temp.min}`,
			},
			{
				label: "Wind Speed: ",
				info: `${elem.wind_speed}`,
			},
		];
		//const date = new Date(elem.dt);
		console.log("Date: " + date);
		const curReportData: WeatherReportDataType = {
			time: date.toString(),
			dataset: reportData,
		};

		return curReportData;
	});
	const reports = Object.keys(reportsData).map((elem, index) => (
		<Box
			id="CurrentReportBox"
			className="cssGridImage"
			/* xs={12} sm={6} md={3} */ style={{
				display: "flex",
			}}
			key={elem}
		>
			{MakeWeatherReport({
				numDay: index,
				curWeatherData: reportsData[index],
				hourlyWeatherData: hourlyWeatherData,
				dayWeatherData: WeatherData[index],
				displayInfo: displayInfoArr[index],
			})}
		</Box>
	));

	return (
		<Container
			id="DailyReportsContainer"
			disableGutters={true}
			maxWidth={false}
			style={{
				flexGrow: 1,
				flexDirection: "column",
				overflow: "auto",
			}}
		>
			{reports[reportIndex]}
			<ReportsPagination weekData={weekData} handleChange={handleChange} />
		</Container>
	);
};
