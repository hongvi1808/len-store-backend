import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PATTERNS, RABBITMQ_SERVICE } from "./rabbit.contant";

export class RabbitService {
    constructor(
        @Inject(RABBITMQ_SERVICE) private client: ClientProxy
    ) { }
    emit(pattern: string, data: any) {
        return this.client.emit(pattern, data);
    }

    send(pattern: string, data: any) {
        return this.client.send(pattern, data);
    }
    sendMailCreatedOrder(order: any) {
        return this.client.emit({ cmd: PATTERNS.SEND_MAIL_CREATED_ORDER }, order);
    }

    sendMailCancelledOrder(order: any) {
        return this.client.send({ cmd:  PATTERNS.SEND_MAIL_CANCELLED_ORDER }, order);
    }
}