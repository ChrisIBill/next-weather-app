const labels = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const data = {
	labels: labels,
	datasets: [
		{
			label: "Test Dataset",
			data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 35, 11, 92],
			fill: false,
			borderColor: "rgb(75, 192, 192)",
			tension: 0.1,
		},
	],
};
export { data };
