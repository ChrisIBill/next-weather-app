import React from 'react'
import { useForecastObjStore } from '@/lib/obj/forecastStore'
export interface WindAnimationComponentProps {}
export const WindAnimationComponent: React.FC<WindAnimationComponentProps> = (
    props: WindAnimationComponentProps
) => {
    const path =
        'M 0 0 Q 2 0 4.8 -0.85 Q 6.943 -1.3 5.8 -2.8 Q 5 -3.6 4.2 -2.8 Q 3.225 -1.3 5.2 -0.85 Q 7.013 0.001 10.011 -0.01 Q 13 0 14 -1'
    const windSpeed = useForecastObjStore((state) => state.windMagnitude.state)
    return (
        <div>
            <svg>
                <path d={path} />
            </svg>
        </div>
    )
}
