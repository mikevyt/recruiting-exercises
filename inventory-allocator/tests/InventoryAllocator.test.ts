import { Warehouse, InventoryAllocator } from '../src/InventoryAllocator';

describe('InventoryAllocator', () => {
    it('should not allocate if falsy values provided', () => {
        let order = new Map<string, number>();
        let inventoryDistribution = [
            { name: 'owd', inventory: new Map([['apple', 1]]) } as Warehouse,
        ];

        let result = new InventoryAllocator().getShipment(
            order,
            inventoryDistribution
        );
        expect(result).toMatchObject([]);

        order = new Map([['apple', 1]]);
        inventoryDistribution = [];

        result = new InventoryAllocator().getShipment(
            order,
            inventoryDistribution
        );
        expect(result).toMatchObject([]);
    });

    it('should not allocate if empty order provided', () => {
        const order = new Map([['apple', 0]]);
        const inventoryDistribution = [
            { name: 'owd', inventory: new Map([['apple', 1]]) } as Warehouse,
        ];

        const result = new InventoryAllocator().getShipment(
            order,
            inventoryDistribution
        );
        expect(result).toMatchObject([]);
    });

    it('should not allocate if not enough inventory', () => {
        const order = new Map([['apple', 1]]);
        const inventoryDistribution = [
            { name: 'owd', inventory: new Map([['apple', 0]]) } as Warehouse,
        ];

        const result = new InventoryAllocator().getShipment(
            order,
            inventoryDistribution
        );
        expect(result).toMatchObject([]);
    });

    it('should exactly match if order matches inventory', () => {
        const order = new Map([['apple', 1]]);
        const inventoryDistribution = [
            { name: 'owd', inventory: new Map([['apple', 1]]) } as Warehouse,
        ];

        const result = new InventoryAllocator().getShipment(
            order,
            inventoryDistribution
        );
        const expected = [new Map([['owd', new Map([['apple', 1]])]])];
        expect(result).toMatchObject(expected);
    });

    it('should split order across warehouses if one cannot supply all of a single item', () => {
        const order = new Map([['apple', 10]]);
        const inventoryDistribution = [
            { name: 'owd', inventory: new Map([['apple', 5]]) } as Warehouse,
            { name: 'dm', inventory: new Map([['apple', 5]]) } as Warehouse,
        ];

        const result = new InventoryAllocator().getShipment(
            order,
            inventoryDistribution
        );
        const expected = [
            new Map([['owd', new Map([['apple', 5]])]]),
            new Map([['dm', new Map([['apple', 5]])]]),
        ];
        expect(result).toMatchObject(expected);
    });

    it('should split order across warehouses if one cannot supply each unique item', () => {
        const order = new Map([
            ['dragon fruit', 1],
            ['kiwi', 2],
        ]);
        const inventoryDistribution = [
            {
                name: 'owd',
                inventory: new Map([['kiwi', 1]]),
            } as Warehouse,
            {
                name: 'dm',
                inventory: new Map([
                    ['dragon fruit', 1],
                    ['kiwi', 2],
                ]),
            } as Warehouse,
        ];

        const result = new InventoryAllocator().getShipment(
            order,
            inventoryDistribution
        );
        const expected = [
            new Map([['owd', new Map([['kiwi', 1]])]]),
            new Map([
                [
                    'dm',
                    new Map([
                        ['dragon fruit', 1],
                        ['kiwi', 1],
                    ]),
                ],
            ]),
        ];
        expect(result).toMatchObject(expected);
    });
});
