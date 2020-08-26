type Order = Map<string, number>;

export type Warehouse = {
    name: string;
    inventory: Map<string, number>;
};

type Shipment = Map<string, Map<string, number>>[];

export class InventoryAllocator {
    constructor() {}

    getShipment(order: Order, warehouses: Warehouse[]): Shipment {
        if (
            !order ||
            order.size === 0 ||
            !warehouses ||
            warehouses.length === 0
        ) {
            return [];
        }

        if (
            Array.from(order.values()).every(
                (orderQuantity: number) => orderQuantity === 0
            )
        ) {
            return [];
        }

        let shipment: Shipment = [];

        for (let warehouse of warehouses) {
            let itemsToShip = new Map<string, number>();
            for (let [item, orderQuantity] of order) {
                if (orderQuantity !== 0) {
                    const stock = warehouse.inventory.get(item);
                    if (stock !== undefined && stock !== 0) {
                        const amountToShip =
                            stock >= orderQuantity ? orderQuantity : stock;
                        itemsToShip.set(item, amountToShip);
                        order.set(item, orderQuantity - amountToShip);
                    }
                }
            }
            shipment.push(new Map([[warehouse.name, itemsToShip]]));
            if (
                Array.from(order.values()).every(
                    (orderQuantity: number) => orderQuantity === 0
                )
            ) {
                return shipment;
            }
        }
        return [];
    }
}
