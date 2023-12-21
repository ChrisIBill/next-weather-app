import { DayTemperatureClass, HourTemperatureClass } from './temperature'

test('DayTemperatureClass', () => {
    const testCases = [
        new DayTemperatureClass([-40, -60], [-45, -65]),
        new DayTemperatureClass([-20, -40], [-25, -45]),
        new DayTemperatureClass([-10, -30], [-15, -35]),
        new DayTemperatureClass([0, -20], [-5, -25]),
        new DayTemperatureClass([0, 0], [0, 0]),
        new DayTemperatureClass([20, 0], [5, 15]),
        new DayTemperatureClass([30, 10], [15, 25]),
    ]
})
