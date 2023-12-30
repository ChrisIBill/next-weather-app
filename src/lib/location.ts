const GOOGLE_LOCATION_TYPE_STRINGS = [
    'street_number',
    'route',
    'street_address',
    'neighborhood',
    'locality',
    'administrative_area_level_2',
    'administrative_area_level_1',
    'country',
    'colloquial_area',
    'premise',
    'park',
    'point_of_interest',
    'natural_feature',
    'airport',
] as const

export interface LocationInterface {
    street_number?: string
    route?: string
    street_address?: string
    neighborhood?: string
    locality?: string
    administrative_area_level_2?: string
    administrative_area_level_1?: string
    country?: string
    colloquial_area?: string
    premise?: string
    park?: string
    point_of_interest?: string
    natural_feature?: string
    airport?: string
    [key: string]: string | undefined
}

export interface LocationDisplayInterface {
    special?: string
    address?: string
    local?: string
    admin?: string
}

export function handleLocation(location: any) {
    if (!location.results || location.results.length == 0) return undefined
    else {
        let loc = {} as LocationInterface
        location.results[0].address_components.forEach((result: any) => {
            if (GOOGLE_LOCATION_TYPE_STRINGS.includes(result.types[0])) {
                loc[result.types[0] as string] = result.long_name
            }
        })
        console.log('Location Handler: ', loc)
        return loc
    }
}

export function getLocationDisplayStrings(location: LocationInterface) {
    console.log('LocationReader: ', location)
    const obj = {} as LocationDisplayInterface
    if (!location) return obj

    if (location.park) obj.special = location.park
    else if (location.airport) obj.special = location.airport
    else if (location.natural_feature) obj.special = location.natural_feature
    else if (location.point_of_interest)
        obj.special = location.point_of_interest
    else if (location.premise) obj.special = location.premise
    else if (location.colloquial_area) obj.special = location.colloquial_area

    if (location.street_number && location.route)
        obj.address = location.street_number + ' ' + location.route
    else if (location.street_address) obj.address = location.street_address
    else if (location.neighborhood) obj.address = location.neighborhood

    if (location.locality) obj.local = location.locality
    else if (location.administrative_area_level_2)
        obj.local = location.administrative_area_level_2

    if (location.administrative_area_level_1)
        obj.admin = location.administrative_area_level_1
    else if (location.administrative_area_level_1 && location.country) {
        obj.admin =
            location.administrative_area_level_1 + ', ' + location.country
    } else if (location.country) obj.admin = location.country
    return obj
}
