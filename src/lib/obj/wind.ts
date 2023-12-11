export const WIND_UNIT_STRINGS = ['ms', 'kph', 'mph', 'kn'] as const
export type WindUnitStringsType = (typeof WIND_UNIT_STRINGS)[number]
