/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { BackgroundComponentsProps } from './components/background/background'
import './rain.scss'
import PrecipitationClass from '@/lib/obj/precipitation'

export interface RainBackgroundProps extends BackgroundComponentsProps {
    isCard: boolean
    precipitation_probability: number
    precipitation: number
    precipitation_type: string
    precipObj: PrecipitationClass
}
export const RainBackground: React.FC<RainBackgroundProps> = (props) => {
    const height = props.height
    const weight = props.precipObj.getMagnitude()
    const numDrops = props.isCard ? 10 * weight : 50 * weight

    const dropKeyframe = keyframes`
        0% {
        transform: translateY(0);
        }
        100% {
            transform: translateY(${height * 1.5}px);
        }
`
    const drops = []
    const backDrops = []
    new Array(numDrops).fill(0).forEach((_, i) => {
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1)
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        const left = (i * 100) / numDrops
        drops.push(
            <div
                key={`drop${i}`}
                className="drop"
                css={css`
                    animation: ${dropKeyframe} 0.5s linear infinite;
                `}
                style={{
                    left: `${left}%`,
                    bottom: `${randoFiver + randoFiver - 1 + 100}%`,
                    animationDelay: `0.${randoHundo}s`,
                    animationDuration: `0.5${randoHundo}s`,
                }}
            >
                {' '}
                <div
                    className="stem"
                    style={{
                        width: `${Math.ceil((weight * 3) / 5)}px`,
                        animationDelay: `0.${randoHundo}s`,
                        animationDuration: `0.5${randoHundo}s`,
                    }}
                ></div>
            </div>
        )
    })
    //const backDrops = []

    //while (increment < 100) {
    //    //couple random numbers to use for various randomizations
    //    //random number between 98 and 1
    //    var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1)
    //    //random number between 5 and 2
    //    var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2)
    //    //increment
    //    increment += randoFiver
    //    //add in a new raindrop with various randomizations to certain CSS properties
    //    drops.push(
    //        <div
    //            className="drop"
    //            style={{
    //                left: `${increment}%`,
    //                bottom: `${randoFiver + randoFiver - 1 + 100}%`,
    //                animationDelay: `0.${randoHundo}s`,
    //                animationDuration: `0.5${randoHundo}s`,
    //            }}
    //        >
    //            {' '}
    //            <div
    //                className="stem"
    //                style={{
    //                    animationDelay: `0.${randoHundo}s`,
    //                    animationDuration: `0.5${randoHundo}s`,
    //                }}
    //            ></div>
    //        </div>
    //    )
    //    backDrops.push(
    //        <div
    //            className="drop"
    //            style={{
    //                right: `${increment}%`,
    //                bottom: `${randoFiver + randoFiver - 1 + 100}%`,
    //                animationDelay: `0.${randoHundo}s`,
    //                animationDuration: `0.5${randoHundo}s`,
    //            }}
    //        >
    //            {' '}
    //            <div
    //                className="stem"
    //                style={{
    //                    animationDelay: `0.${randoHundo}s`,
    //                    animationDuration: `0.5${randoHundo}s`,
    //                }}
    //            ></div>
    //        </div>
    //    )
    //}
    return (
        <div className="rainContainer">
            <div className="rain front-row">{drops}</div>
            {/* <div className="rain back-row">{backDrops}</div> */}
        </div>
    )
}
