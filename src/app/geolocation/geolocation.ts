'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const weatherApiSrc = 'FarTestWeatherData.json'

export interface CoordinatesType {
    latitude: number
    longitude: number
}

export default function GeolocationHandler() {
    const [location, setLocation] = useState<CoordinatesType>()

    const fetchApiData = async ({
        latitude,
        longitude,
    }: {
        latitude: number
        longitude: number
    }) => {
        await fetch(weatherApiSrc)
            .then((result) => result.json())
            .then(
                (result) => {
                    console.log(result)
                },
                (error) => {
                    console.log(error.message)
                }
            )
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

    return location
}
