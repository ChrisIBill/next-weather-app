import { Line } from "react-chartjs-2";
//import { ChartData, ScatterDataPoint } from "chart.js";

import "chart.js/auto";
import { ChartData, ScatterDataPoint } from "chart.js/auto";

type LineChartProps = {
	options: object;
	data: ChartData<"line", (number | ScatterDataPoint | null)[], unknown>;
};

export default function LineChart({ options, data }: LineChartProps) {
	return <Line data={data} options={options} />;
}
