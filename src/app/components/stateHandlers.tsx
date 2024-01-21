import { FullForecastObjectType } from '@/lib/interfaces'
import { useForecastSetStore } from '@/lib/obj/forecastStore'
import logger from '@/lib/pinoLogger'
import { useEffect } from 'react'

export interface CurrentForecastStateHandlerProps {
    forecastObj?: FullForecastObjectType
}

const currentForecastStateHandlerLogger = logger.child({
    module: 'CurrentForecastStateHandler',
})

export const CurrentForecastStateHandler: React.FC<
    CurrentForecastStateHandlerProps
> = (props: CurrentForecastStateHandlerProps) => {
    const setForecastStore = useForecastSetStore()

    useEffect(() => {}, [props.forecastObj])

    useEffect(() => {
        const forecastObj = props.forecastObj?.forecast
        const metadata = props.forecastObj?.metadata
        const location = metadata?.location

        const handleInitialWeather = () => {
            try {
                setForecastStore.setLocation(location!)
                setForecastStore.setTime('current')
                setForecastStore.setCloudMagnitude(
                    forecastObj![0].cloudObj.cloudCover
                )
                setForecastStore.setCloudLightness(
                    forecastObj![0].cloudObj.getCloudLightness()
                )
            } catch (error) {
                currentForecastStateHandlerLogger.error(error)
            }
            try {
                const { getTimePercent, getIsDay, getTimeOfDay } =
                    forecastObj![0].current_weather!.timeObj
                setForecastStore.setTimePercent(getTimePercent!())
                setForecastStore.setIsDay(getIsDay!())
                setForecastStore.setTimeOfDay(getTimeOfDay!())
            } catch (error) {
                currentForecastStateHandlerLogger.error(error)
            }
            try {
                setForecastStore.setRainMagnitude(
                    forecastObj![0].current_weather!.precipitationObj.getMagnitude()
                )
                setForecastStore.setWindMagnitude(
                    forecastObj![0].current_weather!.windObj._beaufort()[0]
                )
                setForecastStore.setTemperatureMagnitude(
                    forecastObj![0].current_weather!.temperatureObj.getMagnitude()
                )
            } catch (error) {
                currentForecastStateHandlerLogger.error(
                    'Error in handleInitialWeather setting current weather: ',
                    {
                        metadata,
                        location,
                        forecastObj,
                    }
                )
                //TODO: need error state
            }
        }
        if (forecastObj && forecastObj[0]) {
            currentForecastStateHandlerLogger.debug('Setting initial weather', {
                metadata,
                location,
            })
            handleInitialWeather()
        }
    }, [props.forecastObj, setForecastStore])

    return null
}
