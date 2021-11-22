import {filter} from "../data";


describe('Filter func', () => {
    let val
    let data
    beforeEach(() => {
        val = 'new '
        data = [
            {name: 'New York'},
            {name: 'Trap City'}
        ]
    })

    it('should return NOT empty',() => {
        expect(filter(val, data)).toBeDefined()
        expect(filter(val, data)).not.toEqual([])
    });

    it('should return one element',() => {
        expect(filter(val, data)).toHaveLength(1)
        expect(filter(val, data)).not.toContainEqual({name: 'Trap City'})
    });
})
