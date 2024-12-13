import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CLS_LOGGING_NAMESPACE } from '../constants/cls-logging.constant';
import { DEFAULT_REQUEST_ID_HEADER } from '../constants/logging.constant';
import { runInLogging } from '../helpers/logging.helper';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private loggingService: LoggingService) {}

    use(req: Request, res: Response, next: () => void): void {
        CLS_LOGGING_NAMESPACE.bindEmitter(req);
        CLS_LOGGING_NAMESPACE.bindEmitter(res);

        CLS_LOGGING_NAMESPACE.run(() => {
            const requestId = this.loggingService.getCurrentRequestId();
            runInLogging(
                {
                    [DEFAULT_REQUEST_ID_HEADER]: requestId
                },
                () => next()
            ).then();
        });
    }
}
