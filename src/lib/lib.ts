function displayTodayOrTomorrow() {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const todayString = today.toDateString();
	const tomorrowString = tomorrow.toDateString();
}

export function weatherImgGenerator(str: string | undefined) {
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
}

export const cancellablePromise = (promise: Promise<any | void>) => {
	const isCancelled = { value: false };
	const wrappedPromise = new Promise((resolve, reject) => {
		promise
			.then((d) => {
				return isCancelled.value ? reject(isCancelled) : resolve(d);
			})
			.catch((e) => {
				reject(isCancelled.value ? isCancelled : e);
			});
	});

	return {
		promise: wrappedPromise,
		cancel: () => {
			isCancelled.value = true;
		},
	};
};
