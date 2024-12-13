import { DynamicModule, Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggingMiddleware } from '../middlewares/logging.middleware';
import { LoggingService } from '../services/logging.service';

@Global()
@Module({})
export class LoggingModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }

    static forRoot(): DynamicModule {
        return {
            module: LoggingModule,
            providers: [LoggingService],
            exports: [LoggingService]
        };
    }
}
