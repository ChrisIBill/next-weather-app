import WindClass from './wind'
import '@testing-library/jest-dom'

test('kphToBeaufort', () => {
    const testCases = [
        new WindClass([0], 0),
        new WindClass([NaN], NaN),
        new WindClass([0, 0], 0),
        new WindClass([NaN, NaN], NaN),
        new WindClass([47, 92], 0),
        new WindClass([48, 92], 240),
        new WindClass([12, 15], 76),
    ]
    expect(testCases[0]._beaufort()).toEqual([0])
    expect(testCases[1]._beaufort()).toEqual([0])
    expect(testCases[2]._beaufort()).toEqual([0, 0])
    expect(testCases[3]._beaufort()).toEqual([0, 0])

    expect(testCases[4].getDescription()).toEqual('strong breeze')
    expect(testCases[4].getGustDescription()).toEqual('storm')

    expect(testCases[0].getCardinalDirection()).toEqual('N')
    expect(testCases[1].getCardinalDirection()).toEqual('N/A')
    expect(testCases[2].getCardinalDirection()).toEqual('N')
    expect(testCases[3].getCardinalDirection()).toEqual('N/A')
    expect(testCases[4].getCardinalDirection()).toEqual('N')
    expect(testCases[5].getCardinalDirection()).toEqual('WSW')
    expect(testCases[6].getCardinalDirection()).toEqual('E')
})
