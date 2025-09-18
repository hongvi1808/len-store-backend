import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailerService } from '../../common/mailer/mailer.service';
import { PATTERNS, QUEUES } from '../../common/rabbitmq/rabbit.contant';
import { ackMessage, nackMessage } from '../../common/rabbitmq/rabit.util';

@Controller()
export class MailConsumer {
  constructor(private readonly mailerService: MailerService){}
  @EventPattern(PATTERNS.SEND_MAIL_CREATED_ORDER)
  async handleOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      // console.log('Gửi email cho:', data.email);
      // if (Math.random() < 0.4) throw new Error('Fake mail error');
      await this.mailerService.sendMail(data.email, 'Created order success', 'Ban da dat hang thanh cong')

      ackMessage(context);
    } catch (err) {
      console.warn('Lỗi:', err.message);
      const retries = data.retryCount ?? 0;

      if (retries < 3) {
        const channel = context.getChannelRef();
        const msg = context.getMessage();
        const newData = { ...data, retryCount: retries + 1 };
        ackMessage(context);
        channel.sendToQueue(QUEUES.MAIL, Buffer.from(JSON.stringify(newData)));
      } else {
        nackMessage(context, false);
      }
    }
  }
}