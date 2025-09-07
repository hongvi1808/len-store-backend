import { PaymentMethod } from "@prisma/client";

export class OrderRes {
     id: string;
     customerId?: string | null;
     code: string;
     createdAt: bigint;
     totalPrice: number
     status: string
}
export class OrderItemsRes {
     id: string;
     orderId: string;
     prodcutId?: string | null;
     name: string;
     price: number;
     quantity: number
}
export class OrderCreate {
     customerId?: string | null;
     totalPrice: number;
     paymentMethod: PaymentMethod;
     note?: string;
     customerInfo?: {name: string, phoneNumber: string, email?: string, address: string}
     products: { id: string, price: number, name: string, quantity: number }[]
}
