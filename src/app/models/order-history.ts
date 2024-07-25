export class OrderHistory {

    constructor(public orderTrackingNumber: string,
                public totalPrice: number, public totalQuantity: number, public dateCreated: Date) {
    }
}
