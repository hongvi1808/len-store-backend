export class OrderRes {
     id: string;
     customerId?: string| null;
     code: string;
     createdAt: bigint;
     totalPrice: number 
     status: string
}
export class OrderItemsRes {
     id: string;
     orderId: string;
     prodcutId?: string| null;
     name: string;
     price: number;
     quantity: number 
}
