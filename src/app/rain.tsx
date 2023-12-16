/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { BackgroundComponentsProps } from './components/background/background'
import './rain.scss'
import PrecipitationClass from '@/lib/obj/precipitation'
import { useForecastObjStore } from '@/lib/stores'
import { WindClassType } from '@/lib/obj/wind'
import { JSX } from '@emotion/react/jsx-runtime'
import {
    ReactElement,
    JSXElementConstructor,
    ReactNode,
    PromiseLikeOfReactNode,
} from 'react'

export interface RainBackgroundWrapperProps extends BackgroundComponentsProps {
    isCard: boolean
    precipObj: PrecipitationClass
    windObj?: WindClassType
}

export const RainBackgroundCardStateWrapper: React.FC<
    RainBackgroundWrapperProps
> = (props: RainBackgroundWrapperProps) => {
    const weight = props.precipObj.getMagnitude()
    const angle = props.windObj?._beaufort()[0] * 3 ?? 0
    return <RainBackground {...props} isCard={true} weight={weight} />
}

export const RainBackgroundPageStateWrapper: React.FC<
    RainBackgroundWrapperProps
> = (props: RainBackgroundWrapperProps) => {
    const weight = useForecastObjStore((state) => state.rainMagnitude.state)
    const angle = useForecastObjStore((state) => state.windMagnitude.state) * 3
    return (
        <RainBackground
            {...props}
            isCard={false}
            weight={weight}
            angle={angle}
        />
    )
}

export const RainBackgroundStateWrapper: React.FC<
    RainBackgroundWrapperProps
> = (props: RainBackgroundWrapperProps) => {
    return props.isCard ? (
        <RainBackgroundCardStateWrapper {...props} />
    ) : (
        <RainBackgroundPageStateWrapper {...props} />
    )
}

export interface RainBackgroundProps extends RainBackgroundWrapperProps {
    weight: number
    angle?: number
}
export const RainBackground: React.FC<RainBackgroundProps> = (props) => {
    const height = props.height
    const weight = props.weight
    const numDrops = props.isCard ? 10 * weight : 50 * weight
    const angle = props.angle ?? 0

    const dropKeyframe = keyframes`
        0% {
        transform: translate(0, 0);
        }
        100% {
            transform: translate(${-angle}%, ${height * 1.5}px);
        }
`
    const drops: JSX.Element[] = []
    const backDrops = []
    new Array(numDrops).fill(0).forEach((_, i) => {
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1)
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        const right = (i * (100 + angle)) / numDrops
        drops.push(
            <div
                key={`drop${i}`}
                className="drop"
                css={css`
                    animation: ${dropKeyframe} 0.5s linear infinite;
                `}
                style={{
                    rotate: `${-angle}deg`,
                    right: `${right}%`,
                    bottom: `${randoFiver + randoFiver - 1 + 100}%`,
                    animationDelay: `0.${randoHundo}s`,
                    animationDuration: `0.5${randoHundo}s`,
                }}
            >
                {' '}
                <div
                    className="stem"
                    style={{
                        rotate: `${-angle * 0.6}deg`,
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
