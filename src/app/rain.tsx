import './rain.css'

export default function RainBackground() {
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
        //add in a new raindrop with various randomizations to certain CSS properties
        drops.push(
            <div className="drop" style={{
                left: `${increment}%`,
                bottom: `${randoFiver + randoFiver - 1 + 100}%`,
                animationDelay: `0.${randoHundo}s`,
                animationDuration: `0.5${randoHundo}s`,
            }
            } > <div className="stem" style={{
                animationDelay: `0.${randoHundo}s`,
                animationDuration: `0.5${randoHundo}s`,
            }}></div></div >
        )
        backDrops.push(
            <div className="drop" style={{
                right: `${increment}%`,
                bottom: `${randoFiver + randoFiver - 1 + 100}%`,
                animationDelay: `0.${randoHundo}s`,
                animationDuration: `0.5${randoHundo}s`,
            }
            } > <div className="stem" style={{
                animationDelay: `0.${randoHundo}s`,
                animationDuration: `0.5${randoHundo}s`,
            }}></div></div >
        )
    }
    return (
        < div className="rainContainer" >
            <div className="rain front-row">
                {drops}
            </div>
            <div className="rain back-row">
                {backDrops}
            </div>
        </div >
    )
}
