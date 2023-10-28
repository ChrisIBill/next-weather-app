import dayjs from 'dayjs'
/**
 * given a string of format YYYY-MM-DD, returns the day of the week
 * [Sunday-Saturday]
 * @param {string} date - YYYY-MM-DD
 * @throws {Error} - [TODO:description]
 * @returns {string} [TODO:description]
 */
export function getDayOfWeek(date: string): string {
    if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
        return dayjs(date).format('dddd')
    } else
        throw new SyntaxError('Invalid date format, require YYYY-MM-DD', {
            cause: date,
        })
}
