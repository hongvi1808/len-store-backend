import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './configs/filters/global-exception.filter';
import { GlobalValidationPipe } from './configs/pipes/global-validation.pipe';
import { TrimPipe } from './configs/pipes/trim.pipe';
import { ResponseFormatInterceptor } from './configs/interceptions/response-format.interceptor';
import { QUEUES } from './common/rabbitmq/rabbit.contant';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BigIntInterceptor } from './configs/interceptions/bigint-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('PORT', { infer: true })

  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true,   });

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  app.use(cookieParser())

  app.use(helmet())
app.use((req, res, next) => {
  if (req.path.startsWith('/.well-known')) {
    return res.status(404).send('Not Found');
  }
  next();
});
  app.setGlobalPrefix(config.get('GLOBAL_API_PREFIX', ''))

  app.useGlobalFilters(new GlobalExceptionFilter())

  app.useGlobalPipes(new GlobalValidationPipe(), new TrimPipe())

  app.useGlobalInterceptors(new ResponseFormatInterceptor(), new BigIntInterceptor())

  // app.useGlobalGuards(new AccessTokenAuthGuard(app.get(Reflector)))
app.use((req, res, next) => {
  if (req.method === 'HEAD' && req.path === '/') {
    return res.status(200).send('OK');
  }
  next();
});
  const configDoc = new DocumentBuilder()
    .setTitle('Lenlen API')
    .setDescription('All the apis of lenlen commerce shop')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header'
    }, 'jwt')
    .addSecurityRequirements('jwt')
    .build()
  const configDocOption: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: true,
    autoTagControllers: true,
  }
  const document = SwaggerModule.createDocument(app, configDoc, configDocOption)
  // documentFactory.security = [{ jwt: [] }]
  SwaggerModule.setup('api-docs', app, document)
app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
      queue: QUEUES.MAIL,
      queueOptions: { durable: true },
    },
  });

  await app.listen(port, () => Logger.verbose(`Server is running on port: ${port}`));
}
bootstrap();
