import { kphToBeaufort } from './wind'
import '@testing-library/jest-dom'

test('kphToBeaufort', () => {
    const testCases = [0, 1, 3, 6, 10, 116, 3029, NaN]
    const expected = [0, 0, 1, 2, 2, 11, 12, 0]
    expect(kphToBeaufort(testCases[0])).toBe(expected[0])
    expect(kphToBeaufort(testCases[1])).toBe(expected[1])
    expect(kphToBeaufort(testCases[2])).toBe(expected[2])
    expect(kphToBeaufort(testCases[3])).toBe(expected[3])
    expect(kphToBeaufort(testCases[4])).toBe(expected[4])
    expect(kphToBeaufort(testCases[5])).toBe(expected[5])
    expect(kphToBeaufort(testCases[6])).toBe(expected[6])
    expect(kphToBeaufort(testCases[7])).toBe(expected[7])
})
