
export const RABBITMQ_SERVICE = 'RABBITMQ_SERVICE';

export const QUEUES = {
    // ORDER: 'order_queue',
    MAIL: 'mail_queue',
    DLQ: 'order_dlq',
};

export const PATTERNS = {
    // ORDER_CREATED: 'order.created',
    // ORDER_UPDATED: 'order.updated',
    // ORDER_CANCELLED: 'order.cancelled',
    SEND_MAIL_CREATED_ORDER: 'send_mail_created_order',
    SEND_MAIL_CANCELLED_ORDER: 'send_mail_cancelled_order',
};
