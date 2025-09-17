import { PaymentMethod } from "@prisma/client";

export class OrderRes {
     id: string;
     code: string;
     createdAt?: bigint;
     customerId?: string | null;
     totalPrice: number;
     status: string
     orderItems: OrderItemsRes[]
}
export class OrderItemsRes {
     id: string;
     orderId?: string;
     prodcutId?: string | null;
     name: string;
     product: {images: any | null}
     price: number;
     classify: any;
     quantity: number
}
export class OrderCreate {
     customerId?: string | null;
     totalPrice: number;
     paymentMethod: PaymentMethod;
     note?: string;
     customerInfo?: { name: string, phoneNumber: string, email?: string, address: string }
     products: { id: string, price: number, name: string, quantity: number, classify?: any }[]
}
