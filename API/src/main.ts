import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable validation for incoming requests
    app.useGlobalPipes(new ValidationPipe());

    // Use the custom exception filter for validation errors
    app.useGlobalFilters(new ValidationExceptionFilter());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
