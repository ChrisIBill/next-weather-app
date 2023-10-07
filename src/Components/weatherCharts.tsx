import { Chart } from "react-chartjs-2";
/* import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title } from "chart.js";
import { ChartTypeRegistry } from "chart.js"; */
import LineChart from "../lib/LineChart";
import { data } from "./chartTest";
import "chart.js/auto";
import {
    AreaChartDataType,
    AreaChartHandlerProps,
    DailyWeatherDataType,
    HourlyWeatherDataType,
    WeatherDataType,
} from "../lib/interfaces";
import moment from "moment";
//ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);
declare module "chart.js" {
    interface ChartTypeRegistry {
        derivedAreaChart: ChartTypeRegistry["bubble"];
    }
}

enum SegmentColors {
    GREEN = "rgba(36, 184, 51, 0.3)",
    BLUE = "rgba(0, 92, 142, 0.3)",
    VIOLET = "#bc35fb",
    BLUE_VIOLET = "#8c90fc",
    ORANGE = "#f2b94a",
}
const TRACKED_DATA = ["Temperature", "Feels Like", "Pressure", "Wind Speed"];
const config = {
    type: "line",
    data: data,
};
const AreaChartHandler = ({
    weatherData,
}: {
    weatherData: AreaChartHandlerProps;
}) => {
    const colors = Object.keys(SegmentColors).map((elem) => elem);
    console.log("Colors: " + colors);
    const options = {
        responsive: true,
        plugins: {
            filler: {
                propagate: true,
            },
        },
    };
    //const data: {  label: string; data: number[]; fill: boolean; borderColor: string}[] =
    /* const data: { label: string; data: number[]; fill: boolean; borderColor: string }[] = datasets.forEach((x, i) => {
		data.push({
			label: labelDatasets[i],
			data: x,
			fill: true,
			borderColor: colors[i],
		});
	}); */
    const data: AreaChartDataType[] = [];
    weatherData.datasets.forEach((x, i) => {
        const sanX: number[] = x.map((elem) => {
            return elem == undefined ? -1000 : (elem = elem);
        });
        data.push({
            label: weatherData.labelDatasets[i],
            data: sanX,
            fill: false,
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: 4,
            pointRadius: 0,
        });
    });
    let dataFinal = {
        labels: weatherData.labels,
        datasets: data,
    };
    return <LineChart data={dataFinal} options={options}></LineChart>;
};
function areaChartDatasetGenerator(weatherDataset: HourlyWeatherDataType[]) {
    if (weatherDataset != undefined) {
        const hoursData: HourlyWeatherDataType[] = weatherDataset;
        const AreaChartProps: AreaChartHandlerProps = {
            labels: [],
            datasets: [],
            labelDatasets: ["Temperature", "Feels Like"],
            title: "Hourly Weather Report",
        };
        const tempsDataset: (number | undefined)[] = [];
        const feelsDataset: (number | undefined)[] = [];
        hoursData.forEach((elem, i) => {
            const xLabel = i % 3 ? moment(elem.dt, "X").format("LT") : "";
            AreaChartProps.labels.push(xLabel);
            tempsDataset.push(elem.temp);
            feelsDataset.push(elem.feels_like);
        });
        AreaChartProps.datasets.push(tempsDataset);
        AreaChartProps.datasets.push(feelsDataset);
        console.log(AreaChartProps);
        return AreaChartProps;
    } else {
        return {
            labels: [],
            datasets: [],
            labelDatasets: TRACKED_DATA,
            title: "Error",
        };
    }
}

/* const areaChart = Chart(document.getElementById("acquisitions") as HTMLCanvasElement, {
	type: ChartTypeRegistry.derivedAreaCharts,
	data: { data },
}); */
export const HourlyWeatherAreaChart = ({
    hourlyWeatherData,
}: {
    hourlyWeatherData: HourlyWeatherDataType[];
}) => {
    const chartDataSet = areaChartDatasetGenerator(hourlyWeatherData);
    return <AreaChartHandler weatherData={chartDataSet} />;
};
