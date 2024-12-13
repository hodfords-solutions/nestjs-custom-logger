<p align="center">
  <a href="http://opensource.hodfords.uk" target="blank"><img src="https://opensource.hodfords.uk/img/logo.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">
NestJS Logging package to support structure log format and propgate request_id across service calls
</p>

## Installation 🤖
To begin using it, we first install the required dependencies.
```
npm install @hodfords/nestjs-custom-logger
```

## Configuration 🚀
#### Create logging.config.ts
```typescript
import { createLoggingConfig, LoggingModule } from '@hodfords/nestjs-custom-logger';
import { env, isLocal } from './env.config';

export const loggingConfig = createLoggingConfig({
    serviceName: env.APP_NAME,
    isLocal // if True, it will print as NestJS like, otherwise it will prints as json format
});

export const loggingModuleConfig = LoggingModule.forRoot();
```

#### Config to NestJS app
```typescript
this.app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: loggingConfig
});
```

#### Config for microservice
**Client side**
```typescript
import { setGrpcLoggingMetadata } from '@hodfords/nestjs-custom-logger';

MicorserviceModule.register({
    url: env.MICROSERVICES.SERVICE.URL,
    timeout: 5000,
    requestInitializer: (metadata: Metadata) => {
        setGrpcLoggingMetadata(metadata);
    }
}),
```
**Server side**

You can add GrpcLoggingInterceptor into your app interceptor like this
```typescript
import { GrpcLoggingInterceptor } from '@hodfords/nestjs-logging';

export function GrpcMicroservice(description?: string): any {
    return applyDecorators(
        Controller(),
        UseFilters(GrpcExceptionFilter),
        UsePipes(validateConfig),
        UseInterceptors(
            ClassSerializerInterceptor,
            new GrpcTranslationInterceptor([LANGUAGE_KEY]),
            new GrpcLoggingInterceptor() // add interceptor here
        ),
        RegisterGrpcMicroservice(description),
        UseResponseInterceptor()
    );
}
```


## Usage 🚀

```typescript
class AppController {
    private logger = new Logger(APpController.name);

    @Get()
    async getHello(): Promise<string> {
        this.logger.log('Hello World!');

        return 'Hello World!';
    }
}
```

## License
This project is licensed under the MIT License
