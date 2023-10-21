'use client'

import { TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './search-bar.module.css'

export default function SearchBar() {
    const router = useRouter()

    const [userAddress, setUserAddress] = useState<string>('')
    const [isInputError, setIsInputError] = useState<boolean>(false)
    const [isValid, setIsValid] = useState<boolean>(false)
    const [helperText, setHelperText] = useState<string>('')
    const [location, setLocation] = useState<CoordinatesType>()

    const zipCodeRegEx = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/
    const handleEnterKey = async (e: { keyCode: number }) => {
        if (e.keyCode == 13) {
            if (zipCodeRegEx.test(userAddress)) {
                console.log('Enter key pressed')
                setIsInputError(false)
                router.replace(`/weather?zipCode={}`)
                //getGeocode(zipCode).then((value) => submitCoords(value))
                //setIsValid(true);
            } else {
                setHelperText('Please enter a valid 5 digit US Zip Code')
                setIsInputError(true)
            }
        }
    }

    const handleChange = (e: any) => {
        const regex = /^[0-9\b]+$/
        console.log(e.keycode)
        if (e.target.value === '' || regex.test(e.target.value)) {
            setUserAddress(e.target.value)
            setIsInputError(false)
            setHelperText('')
        } else {
            setIsInputError(true)
            setHelperText('Please enter numbers only')
        }
    }
    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            console.log("here")
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                console.log("here2")
                const { latitude, longitude } = coords
                console.log("Coords: ", coords)
                setLocation({ latitude, longitude })
                router.replace(`/weather?lat=${latitude}&lon=${longitude}`)
            })
        }
    }, [router])

    return (
        <TextField
            className={styles.searchBar}
            label="Location"
            variant="filled"
            sx={{ borderRadius: '1rem' }}
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => handleEnterKey(e)}
            value={userAddress}
            error={isInputError}
            helperText={helperText}
        />
    )
}
