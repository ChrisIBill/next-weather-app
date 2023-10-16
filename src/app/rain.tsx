import styles from './rain.module.css'

function makeItRain() {
    //clear out everything
    //$('.rain').empty()

    var increment = 0
    const drops = []
    const backDrops = []

    while (increment < 100) {
        //couple random numbers to use for various randomizations
        //random number between 98 and 1
        var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1)
        //random number between 5 and 2
        var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        //increment
        increment += randoFiver
        const dropStyle = "left: " + increment + "%; bottom: " + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + "s;"
        const stemStyle: String = "animation-delay: 0." + randoHundo + 's; animation-duration: 0.5' + randoHundo + "s;"
        //add in a new raindrop with various randomizations to certain CSS properties
        drops.append(
            <div class="drop" style={dropStyle} ><div class="stem" style={stemStyle}></div></div>
        )
        backDrops +=
            '<div class="drop" style="right: ' +
            increment +
            '%; bottom: ' +
            (randoFiver + randoFiver - 1 + 100) +
            '%; animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"><div class="stem" style="animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"></div><div class="splat" style="animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"></div></div>'
    }

    //    $('.rain.front-row').append(drops)
    //    $('.rain.back-row').append(backDrops)
}

export default function RainBackground() {
    var increment = 0
    var drops = ''
    var backDrops = ''

    while (increment < 100) {
        //couple random numbers to use for various randomizations
        //random number between 98 and 1
        var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1)
        //random number between 5 and 2
        var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        //increment
        increment += randoFiver
        //add in a new raindrop with various randomizations to certain CSS properties
        drops +=
            '<div class="drop" style="left: ' +
            increment +
            '%; bottom: ' +
            (randoFiver + randoFiver - 1 + 100) +
            '%; animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"><div class="stem" style="animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"></div><div class="splat" style="animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"></div></div>'
        backDrops +=
            '<div class="drop" style="right: ' +
            increment +
            '%; bottom: ' +
            (randoFiver + randoFiver - 1 + 100) +
            '%; animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"><div class="stem" style="animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"></div><div class="splat" style="animation-delay: 0.' +
            randoHundo +
            's; animation-duration: 0.5' +
            randoHundo +
            's;"></div></div>'
    }
    return (
        < div className={styles.rainContainer} >
            <div className="rain.front-row">
                {drops}
            </div>
            <div className="rain.back-row">
                {backDrops}
            </div>
        </div >
    )
}
