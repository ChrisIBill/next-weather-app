import { useWindowDimensions } from '@/lib/hooks'
import styles from './lightning.module.scss'

//export interface LightningGenProps {}
//const lightningGenerator: React.FC<LightningGenProps> = () => {
//    const { width, height } = useWindowDimensions()
//    const generateRandomInt = (min: number, max: number): number => {
//        return Math.floor(Math.random() * (max - min + 1)) + min
//    }
//    const lightning = []
//    function createLightning() {
//        var x = generateRandomInt(100, width - 100)
//        var y = generateRandomInt(0, height / 4)
//
//        var createCount = generateRandomInt(1, 3)
//        for (var i = 0; i < createCount; i++) {
//            const single = {
//                x: x,
//                y: y,
//                xRange: generateRandomInt(5, 30),
//                yRange: generateRandomInt(10, 25),
//                path: [
//                    {
//                        x: x,
//                        y: y,
//                    },
//                ],
//                pathLimit: generateRandomInt(40, 55),
//            }
//            lightning.push(single)
//        }
//    }
//    function drawLightning() {
//        for (var i = 0; i < lightning.length; i++) {
//            var light = lightning[i]
//
//            light.path.push({
//                x:
//                    light.path[light.path.length - 1].x +
//                    (generateRandomInt(0, light.xRange) - light.xRange / 2),
//                y:
//                    light.path[light.path.length - 1].y +
//                    generateRandomInt(0, light.yRange),
//            })
//
//            if (light.path.length > light.pathLimit) {
//                lightning.splice(i, 1)
//            }
//
//            ctx3.strokeStyle = 'rgba(255, 255, 255, .1)'
//            ctx3.lineWidth = 3
//            if (random(0, 15) === 0) {
//                ctx3.lineWidth = 6
//            }
//            if (random(0, 30) === 0) {
//                ctx3.lineWidth = 8
//            }
//
//            ctx3.beginPath()
//            ctx3.moveTo(light.x, light.y)
//            for (var pc = 0; pc < light.path.length; pc++) {
//                ctx3.lineTo(light.path[pc].x, light.path[pc].y)
//            }
//            if (Math.floor(random(0, 30)) === 1) {
//                //to fos apo piso
//                ctx3.fillStyle =
//                    'rgba(255, 255, 255, ' + random(1, 3) / 100 + ')'
//                ctx3.fillRect(0, 0, w, h)
//            }
//            ctx3.lineJoin = 'miter'
//            ctx3.stroke()
//        }
//    }
//    return <div className={styles.lightningLayer}></div>
//}
