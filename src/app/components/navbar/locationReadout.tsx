import { getLocationDisplayStrings } from '@/lib/location'
import { useForecastObjStore } from '@/lib/obj/forecastStore'
import { Typography, useTheme } from '@mui/material'
import styles from './navbar.module.scss'

export interface LocationReadoutProps {
    isSearchExpanded: boolean
}

export const LocationReadout: React.FC<LocationReadoutProps> = (
    props: LocationReadoutProps
) => {
    const theme = useTheme()
    const location = useForecastObjStore((state) => state.location.state)
    if (!location) return null
    const displayStrings = getLocationDisplayStrings(location)
    if (
        !displayStrings ||
        (!displayStrings.special &&
            !displayStrings.local &&
            !displayStrings.admin)
    )
        return null
    return (
        <div
            className={styles.flexContainer}
            style={{
                opacity: props.isSearchExpanded ? 0 : 1,
                //transition: 'opacity 0.5s ease',
                width: props.isSearchExpanded ? '0' : '100%',
                transitionDuration: '0.5s',
            }}
        >
            <div className={styles.locationReadoutWrapper}>
                <Typography
                    variant="body1"
                    component="h3"
                    fontWeight={'normal'}
                    noWrap
                    textAlign="center"
                    sx={{
                        [theme.breakpoints.down('sm')]: {
                            fontSize: '1rem',
                        },
                    }}
                >
                    {displayStrings.special
                        ? `${displayStrings.special}`
                        : displayStrings.address
                        ? `${displayStrings.address}`
                        : displayStrings.local
                        ? `${displayStrings.local}`
                        : displayStrings.admin
                        ? `${displayStrings.admin}`
                        : null}
                </Typography>
                <Typography
                    variant="body1"
                    component="h4"
                    fontWeight={'bold'}
                    textAlign="center"
                    noWrap
                >
                    {displayStrings.address || displayStrings.special
                        ? displayStrings.local && displayStrings.admin
                            ? `${displayStrings.local}, ${displayStrings.admin}`
                            : displayStrings.admin
                            ? `${displayStrings.admin}`
                            : null
                        : null}
                </Typography>
            </div>
        </div>
    )
}
