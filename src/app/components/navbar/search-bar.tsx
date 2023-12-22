'use client'

import {
    Autocomplete,
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
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
import SearchIcon from '@mui/icons-material/Search'
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

export interface SearchBarProps {
    isExpanded: boolean
    handleExpand: (arg: boolean) => void
}

const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {
    const isExpanded = props.isExpanded
    const searchPs = useSearchParams()
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
            console.log('handleEnterKey: ', router)
            //history.replaceState(null, '', '/weather')
            if (zipCodeRegEx.test(userAddress)) {
                console.log('Enter key pressed')
                setIsInputError(false)
                router.push('/weather?' + 'address=' + userAddress.toString())
            } else if (cityStateRegEx.test(userAddress)) {
                setIsInputError(false)
                router.push('/weather?' + 'address=' + userAddress.toString())
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

    const collapsedSearchBarStyle = {
        width: '2.5rem',
        transitionDuration: '0.5s',
    }

    const expandedSearchBarStyle = {
        borderRadius: '2.5rem',
        width: '200px',
        transitionDuration: '0.5s',
    }

    const expandedSearchIconStyle = {
        opacity: 0,
        transitionDuration: '0.5s',
    }
    const collapsedSearchIconStyle = {
        opacity: 1,
        transitionDuration: '0.5s',
    }

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
                        'lat=' +
                        latitude.toString() +
                        '&' +
                        'lon=' +
                        longitude.toString()
                )
            })
        } else if (location !== undefined) {
            if (pathname === '/') {
                //Need to reroute to weather page
                router.replace(
                    '/weather?' +
                        'lat=' +
                        location.latitude.toString() +
                        '&' +
                        'lon=' +
                        location.longitude.toString()
                )
            }
        }
    }, [router, location, pathname])

    return (
        <FormControl
            className={styles.searchForm}
            data-theme="dark"
            sx={{
                position: 'relative',
            }}
            style={
                isExpanded
                    ? {
                          width: '200px',
                          transitionDuration: '0.5s',
                      }
                    : {
                          width: '2.5rem',
                          transitionDuration: '0.5s',
                      }
            }
        >
            <InputLabel
                htmlFor="location-search"
                className={styles.searchLabel}
                sx={{
                    display: isExpanded ? 'block' : 'none',
                    color: palette.text.secondary,
                    '&.Mui-focused': {
                        color: palette.text.primary,
                    },
                }}
            >
                Location
            </InputLabel>
            <OutlinedInput
                id="location-search"
                sx={{
                    position: 'absolute',
                    paddingLeft: '0',
                    top: '0',
                    right: '0',
                    color: palette.text.primary,
                    backgroundColor: palette.background.paper,
                    border: `1px solid ${palette.text.secondary}`,
                    boxShadow: 'none',
                    borderRadius: '2.5rem',
                    transitionDuration: '0.5s',
                    //'& fieldset': {
                    //    borderColor: palette.text.secondary,
                    //},
                    //'& input:valid + fieldset': {
                    //    borderColor: palette.text.primary,
                    //},
                    '& input:focus + fieldset': {},
                    '&.MuiOutlinedInput-inputTypeSearch': {
                        paddingLeft: '2.5rem',
                    },
                    '&.Mui-error': {
                        border: `2px solid ${palette.error.main}`,
                        boxShadow: '0 0 10px rgba(200,0,0,0.5)',
                    },
                }}
                inputProps={{
                    style: {
                        paddingLeft: '.5rem',
                    },
                }}
                notched
                className={styles.searchBar}
                onFocus={() => props.handleExpand(true)}
                onBlur={() => props.handleExpand(false)}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => handleEnterKey(e)}
                value={userAddress}
                error={isInputError}
                startAdornment={
                    <SearchIcon
                        sx={{
                            pointerEvents: 'none',
                            position: 'relative',
                            left: '7px',
                        }}
                    />
                }
            />

            {/* <SearchIcon */}
            {/*     sx={{ */}
            {/*         //display: isExpanded ? 'none' : 'block', */}
            {/*         pointerEvents: 'none', */}
            {/*         position: 'absolute', */}
            {/*         top: '20%', */}
            {/*         left: '0.6rem', */}
            {/*     }} */}
            {/* /> */}
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

export default SearchBar
