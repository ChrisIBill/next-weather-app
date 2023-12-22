/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { BackgroundComponentsProps } from './components/background/background'
import './rain.scss'
import PrecipitationClass from '@/lib/obj/precipitation'
import { useForecastObjStore } from '@/lib/obj/forecastStore'
import { WindClassType } from '@/lib/obj/wind'
import { JSX } from '@emotion/react/jsx-runtime'
import { BEAUFORT_SPEEDS } from '@/lib/obj/constants'
import { useLogger } from 'next-axiom'

export interface RainBackgroundWrapperProps extends BackgroundComponentsProps {
    isCard: boolean
    precipObj: PrecipitationClass
    windObj?: WindClassType
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

export const RainBackgroundCardStateWrapper: React.FC<
    RainBackgroundWrapperProps
> = (props: RainBackgroundWrapperProps) => {
    const weight = props.precipObj.getMagnitude()
    const beaufort = props.windObj ? props.windObj._beaufort()[0] : 0
    let bSpeed = BEAUFORT_SPEEDS[beaufort]
    if (bSpeed === undefined) bSpeed = 0
    if (bSpeed > 130) bSpeed = 130
    const angle = bSpeed / 130
    return (
        <RainBackground
            {...props}
            isCard={true}
            weight={weight}
            angle={angle}
        />
    )
}

export const RainBackgroundPageStateWrapper: React.FC<
    RainBackgroundWrapperProps
> = (props: RainBackgroundWrapperProps) => {
    const weight = useForecastObjStore((state) => state.rainMagnitude.state)
    let bSpeed =
        BEAUFORT_SPEEDS[
            useForecastObjStore((state) => state.windMagnitude.state)
        ]
    if (bSpeed === undefined) bSpeed = 0
    if (bSpeed > 130) bSpeed = 130
    const angle = bSpeed / 130
    return (
        <RainBackground
            {...props}
            isCard={false}
            weight={weight}
            angle={angle}
        />
    )
}

export interface RainBackgroundProps extends RainBackgroundWrapperProps {
    weight: number
    angle?: number
}
export const RainBackground: React.FC<RainBackgroundProps> = (props) => {
    const log = useLogger()

    const height = props.height
    const width = props.width
    const weight = props.weight
    const numDrops = props.isCard ? 10 * weight : 50 * weight
    const angle = props.angle ?? 0

    const transX = angle * 0.5 * width
    const transY = (height ?? 0) * 1.5
    const adjustedWidth = width + transX
    const dropKeyframe = keyframes`
        0% {
        transform: translate(0, 0);
        }
        100% {
            transform: translate(${transX}px, ${transY}px);
        }
`
    log.debug('RainBackground: ', {
        angle,
        height,
        width,
        isCard: props.isCard,
    })
    const drops: JSX.Element[] = []
    const backDrops = []

    for (let i = 0; i < numDrops; i++) {
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1)
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        const right = (i / numDrops) * adjustedWidth
        drops.push(
            <div
                key={`drop${i}`}
                className="drop"
                css={css`
                    animation: ${dropKeyframe} 9.5s linear infinite;
                `}
                style={{
                    rotate: `${-angle * 27}deg`,
                    right: `${right}px`,
                    bottom: `${randoFiver + randoFiver - 1 + 100}%`,
                    animationDelay: `0.${randoHundo}s`,
                    animationDuration: `0.5${randoHundo}s`,
                }}
            >
                {' '}
                <div
                    className="stem"
                    style={{
                        rotate: `${-angle * 20}deg`,
                        width: `${Math.ceil((weight * 3) / 5)}px`,
                        animationDelay: `0.${randoHundo}s`,
                        animationDuration: `0.5${randoHundo}s`,
                    }}
                ></div>
            </div>
        )
    }
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
        <div className="rainContainer" style={{}}>
            <div className="rain front-row">{drops}</div>
            {/* <div className="rain back-row">{backDrops}</div> */}
        </div>
    )
}
