import { Paper, Slider, Typography, useTheme } from '@mui/material'
import styles from './playgroundSliders.module.scss'
import { HourlyForecastObjectType } from '@/lib/interfaces'

export interface PlaygroundSlidersProps {
    forecastVars: {
        time: number
        temperature: number
        rainVolume: number
        snowVolume: number
        windSpeed: number
        cloudCover: number
    }
    changeHandlers: {
        handleTimeChange: (event: any, newValue: number) => void
        handleTemperatureChange: (event: any, newValue: number) => void
        handleRainVolumeChange: (event: any, newValue: number) => void
        handleSnowVolumeChange: (event: any, newValue: number) => void
        handleWindSpeedChange: (event: any, newValue: number) => void
        handleCloudCoverChange: (event: any, newValue: number) => void
    }
}
export const PlaygroundSliders: React.FC<PlaygroundSlidersProps> = (
    props: PlaygroundSlidersProps
) => {
    const palette = useTheme().palette
    return (
        <Paper
            className={styles.sliderWrapper}
            sx={{
                padding: '1rem',
                position: 'relative',
                zIndex: 100,
                backgroundColor: palette.primary.main,
            }}
        >
            <Typography id="continuous-slider">Time</Typography>
            <Slider
                size="small"
                max={23}
                marks
                step={1}
                value={props.forecastVars.time}
                onChange={(event, newValue) =>
                    props.changeHandlers.handleTimeChange(
                        event,
                        newValue as number
                    )
                }
                aria-label="Time Slider"
                valueLabelDisplay="auto"
                sx={{
                    width: '10rem',
                }}
            />
            <Typography id="continuous-slider">Temperature</Typography>
            <Slider
                size="small"
                value={props.forecastVars.temperature}
                min={-40}
                max={50}
                onChange={(event, newValue) =>
                    props.changeHandlers.handleTemperatureChange(
                        event,
                        newValue as number
                    )
                }
                aria-label="Temperature Slider"
                valueLabelDisplay="auto"
            />
            <Typography>Rain Volume</Typography>
            <Slider
                size="small"
                value={props.forecastVars.rainVolume}
                min={0}
                max={50}
                onChange={(event, newValue) =>
                    props.changeHandlers.handleRainVolumeChange(
                        event,
                        newValue as number
                    )
                }
                aria-label="Rain Volume Slider"
                valueLabelDisplay="auto"
            />
            <Typography>Wind Speed</Typography>
            <Slider
                size="small"
                value={props.forecastVars.windSpeed}
                onChange={(event, newValue) =>
                    props.changeHandlers.handleWindSpeedChange(
                        event,
                        newValue as number
                    )
                }
                aria-label="Wind Slider"
            />
        </Paper>
    )
}
