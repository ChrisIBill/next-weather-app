'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export interface CoordinatesType {
    latitude: number
    longitude: number
}

export default function Mensen() {
    const [mensen, setMensen] = useState([])
    const [location, setLocation] = useState<CoordinatesType>()

    const fetchApiData = async ({
        latitude,
        longitude,
    }: {
        latitude: number
        longitude: number
    }) => {
        const res = await fetch(
            `https://openmensa.org/api/v2/canteens?near[lat]=${latitude}&near[lng]=${longitude}&near[dist]=50000`
        )
        const data = await res.json()
        setMensen(data)
    }

    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords
                setLocation({ latitude, longitude })
            })
        }
    }, [])

    useEffect(() => {
        // Fetch data from API if `location` object is set
        if (location) {
            fetchApiData(location)
        }
    }, [location])

    return (
        <div>
            <h1>Alle Mensen</h1>
            <p>Alle Mensen</p>
            {mensen?.length > 0 &&
                mensen.map((mensa) => (
                    <Link href={`/mensen/${mensa.id}`} key={mensa.id}>
                        <a className={styles.single}>
                            <h3>{mensa.name}</h3>
                        </a>
                    </Link>
                ))}
        </div>
    )
}
