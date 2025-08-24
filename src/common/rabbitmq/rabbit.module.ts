import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { QUEUES, RABBITMQ_SERVICE } from "./rabbit.contant";
import { RabbitService } from "./rabbit.service";

@Module({
    imports: [
        ClientsModule.registerAsync([{
              imports: [ConfigModule],
              inject: [ConfigService],
              name: RABBITMQ_SERVICE,
               useFactory: (configService) => ({
                name: RABBITMQ_SERVICE,
                transport: Transport.RMQ,
                options: {
                  urls: [configService.get('RABBITMQ_URL')],
                  queue: QUEUES.MAIL,
                  queueOptions: {
                    durable: true,
                    deadLetterExchange: '', // dùng default exchange
                    deadLetterRoutingKey: QUEUES.DLQ, // nếu lỗi -> đẩy vào queue này
                  },
                },
              })
            }]),
    ],
    controllers: [],
    providers: [RabbitService],
    exports: [RabbitService],
    })
export class RabbitModule {}