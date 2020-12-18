import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomWsAdapter } from './sockets/custom-adapter';
import { loggingMiddleware } from './middlewares/logging';
import { metricMiddleware } from './middlewares/metric';
import * as helmet from 'helmet';
const packageJson = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new CustomWsAdapter(app));
  app.use(helmet());
  app.use(loggingMiddleware);
  app.use(metricMiddleware);

  const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const port = 8090;
  await app.listen(port, () => console.log(`[HTTP] Listening on ${port}...`));
}
bootstrap();
