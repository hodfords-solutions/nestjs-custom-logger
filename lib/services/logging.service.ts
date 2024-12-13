import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CLS_LOGGING_NAMESPACE } from '../constants/cls-logging.constant';
import { DEFAULT_REQUEST_ID_HEADER } from '../constants/logging.constant';

@Injectable()
export class LoggingService {
    static instance: LoggingService;

    constructor() {
        LoggingService.instance = this;
    }

    getCurrentRequestId(key = DEFAULT_REQUEST_ID_HEADER): string {
        let requestId = CLS_LOGGING_NAMESPACE.get(key);
        if (!requestId) {
            requestId = randomUUID();
            CLS_LOGGING_NAMESPACE.set(key, requestId);
        }

        return requestId;
    }
}
