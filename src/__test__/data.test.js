import {filter} from "../data";

describe('Filter func', () => {
    const val = 'new '
    const data = [
        {name: 'New York'}
    ]

    it('should return NOT empty',() => {
        expect(filter(val, data)).toBeDefined()
        expect(filter(val, data)).not.toEqual([])
    });
})
