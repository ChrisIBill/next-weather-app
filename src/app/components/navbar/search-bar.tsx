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
    styled,
    useTheme,
} from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import styles from './navbar.module.scss'
import { CoordinatesType } from '@/lib/interfaces'
import palette from '@/lib/export.module.scss'
import paletteHandler from '@/lib/paletteHandler'

const ValidationOutlinedInput = styled(OutlinedInput)({
    '& input:valid + fieldset': {
        borderWidth: 2,
    },
    '& input:invalid + fieldset': {
        borderColor: 'red',
        borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
        borderLeftWidth: 6,
        padding: '4px !important', // override inline-style
    },
})

export default function SearchBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const theme = useTheme()
    const palette = theme.palette
    //const palette = paletteHandler(theme.theme)

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
                setHelperText(
                    'Please enter a valid 5 digit US Zip Code, or a city and state'
                )
                setIsInputError(true)
            }
        }
    }

    const handleChange = (e: any) => {
        const regex = /^[0-9a-zA-Z \b]+$/
        console.log(e.keycode)
        if (e.target.value === '' || regex.test(e.target.value)) {
            setUserAddress(e.target.value)
            setIsInputError(false)
            setHelperText('')
        } else {
            setIsInputError(true)
            setHelperText('Please enter numbers, letters and spaces only')
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
        <FormControl className={styles.searchForm} data-theme="dark" sx={{}}>
            <InputLabel
                htmlFor="location-search"
                className={styles.searchLabel}
                sx={{
                    color: palette.text.secondary,
                }}
            >
                Location
            </InputLabel>
            <OutlinedInput
                id="location-search"
                sx={{
                    color: palette.text.primary,
                    '& fieldset': {
                        borderColor: palette.text.secondary,
                    },
                    '& input:valid + fieldset': {
                        borderColor: palette.text.primary,
                    },
                    '& input:focus + fieldset': {
                        borderColor: palette.secondary.main,
                    },
                    '& input:valid:focus + fieldset': {
                        border: `0.1rem solid ${palette.secondary.main}`,
                    },
                }}
                className={styles.searchBar}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => handleEnterKey(e)}
                value={userAddress}
                error={isInputError}
            />
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}
