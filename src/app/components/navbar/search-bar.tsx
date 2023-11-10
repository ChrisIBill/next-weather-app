'use client'

import {
    Autocomplete,
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    InputBase,
    InputLabel,
    OutlinedInput,
    TextField,
} from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import styles from './navbar.module.scss'
import { CoordinatesType } from '@/lib/interfaces'
import palette from '@/lib/export.module.scss'
import paletteHandler from '@/lib/paletteHandler'
import { useTheme } from '@/lib/context'

export default function SearchBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const theme = useTheme()
    const palette = paletteHandler(theme.theme)

    const [userAddress, setUserAddress] = useState<string>('')
    const [isInputError, setIsInputError] = useState<boolean>(false)
    const [helperText, setHelperText] = useState<string>('')
    const [location, setLocation] = useState<CoordinatesType>()

    const zipCodeRegEx = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/
    const cityStateRegEx = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
    const handleEnterKey = async (e: { keyCode: number }) => {
        if (e.keyCode == 13) {
            if (zipCodeRegEx.test(userAddress)) {
                console.log('Enter key pressed')
                setIsInputError(false)
                router.replace(
                    '/weather?' +
                        createQueryString('address', userAddress.toString())
                )
            } else if (cityStateRegEx.test(userAddress)) {
                setIsInputError(false)
                router.replace(
                    '/weather?' +
                        createQueryString('address', userAddress.toString())
                )
            } else {
                setHelperText('Please enter a valid 5 digit US Zip Code')
                setIsInputError(true)
            }
        }
    }

    const handleChange = (e: any) => {
        const regex = /^[0-9a-zA-Z\b]+$/
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

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        console.log('LOC: ', location, typeof location)
        if ('geolocation' in navigator && location === undefined) {
            console.log('Geolocation available')
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords
                console.log('Coords: ', coords)
                //TODO: cant update router and state at same time, need to decide if state is needed
                setLocation({ latitude, longitude })
                router.replace(
                    '/weather?' +
                        createQueryString('lat', latitude.toString()) +
                        '&' +
                        createQueryString('lon', longitude.toString())
                )
            })
        } else if (location !== undefined) {
            if (pathname === '/') {
                //Need to reroute to weather page
                router.replace(
                    '/weather?' +
                        createQueryString('lat', location.latitude.toString()) +
                        '&' +
                        createQueryString('lon', location.longitude.toString())
                )
            }
        }
    }, [createQueryString, router, location, pathname])

    return (
        <FormControl className={styles.searchBar} data-theme="dark" sx={{}}>
            <FormLabel className={styles.inputLabel}>Location</FormLabel>
            <OutlinedInput
                sx={{
                    color: palette.textPrimary,
                    background: palette.accent,
                }}
                className={styles.inputBase}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => handleEnterKey(e)}
                value={userAddress}
                error={isInputError}
            />
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}
