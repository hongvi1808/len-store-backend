import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

export function getChannel(context: RmqContext): Channel {
  return context.getChannelRef();
}

export function getMessage(context: RmqContext): Message {
  return context.getMessage();
}

export function ackMessage(context: RmqContext) {
  const channel = getChannel(context);
  const msg = getMessage(context);
  channel.ack(msg);
}

export function nackMessage(context: RmqContext, requeue = false) {
  const channel = getChannel(context);
  const msg = getMessage(context);
  channel.nack(msg, false, requeue);
}