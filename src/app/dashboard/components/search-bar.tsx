'use client'
import { TextField } from '@mui/material'
import { useState } from 'react'

export default function SearchBar() {
    const [userAddress, setUserAddress] = useState<string>('')
    const [isInputError, setIsInputError] = useState<boolean>(false)
    const [isValid, setIsValid] = useState<boolean>(false)
    const [helperText, setHelperText] = useState<string>('')

    const zipCodeRegEx = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/
    const handleEnterKey = async (e: { keyCode: number }) => {
        if (e.keyCode == 13) {
            if (zipCodeRegEx.test(userAddress)) {
                console.log('Enter key pressed')
                setIsInputError(false)
                getGeocode(zipCode).then((value) => submitCoords(value))
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
    return (
        <TextField
            id="location-search-bar"
            label="Location"
            variant="outlined"
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => handleEnterKey(e)}
            value={userAddress}
            error={isInputError}
            helperText={helperText}
        />
    )
}
