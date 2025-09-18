import { Module } from "@nestjs/common";
import { MailConsumer } from "./mail.consumer";
import { MailerModule } from "../../common/mailer/mailer.module";

@Module({
    imports: [MailerModule],
    controllers: [MailConsumer],
    providers: [],
    exports: [],
    })
export class MailConsumerModule {}