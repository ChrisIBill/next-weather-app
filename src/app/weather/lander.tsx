import { Typography } from '@mui/material'
import dayjs from 'dayjs'

export interface LanderProps {
    currentWeather: any
}
export const Lander: React.FC<LanderProps> = (props: LanderProps) => {
    const time: string = props.currentWeather?.time
    const hour: number = dayjs(time).hour()
    const greeting = (): string => {
        switch (hour) {
            case 0:
                return 'Good morning'
            case 12:
                return 'Good afternoon'
            case 15:
                return 'Good Day'
            case 18:
                return 'Good evening'
            default:
                return 'Hello'
        }
    }
    return (
        <div className="landerWrapper">
            <Typography variant="h1" component="h1">
                {greeting()}
            </Typography>
        </div>
    )
}
