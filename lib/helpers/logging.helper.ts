import { CLS_LOGGING_NAMESPACE } from '../constants/cls-logging.constant';
import { DEFAULT_REQUEST_ID_HEADER } from '../constants/logging.constant';
import { LoggingService } from '../services/logging.service';
import { RunInLoggingParams } from '../types/cls-logging.type';

export function getLoggingRequestId(): string {
    return LoggingService.instance.getCurrentRequestId();
}

export function setGrpcLoggingMetadata(metadata: any) {
    metadata.set(DEFAULT_REQUEST_ID_HEADER, LoggingService.instance.getCurrentRequestId());
}

export function runInLogging<T>(params: RunInLoggingParams, callback: (...args: (string | object)[]) => T): Promise<T> {
    return CLS_LOGGING_NAMESPACE.runAndReturn(async () => {
        if (typeof params == 'string') {
            CLS_LOGGING_NAMESPACE.set(DEFAULT_REQUEST_ID_HEADER, params);
        } else if (params && typeof params === 'object') {
            for (const [key, requestId] of Object.entries(params)) {
                CLS_LOGGING_NAMESPACE.set(key, requestId);
            }
        }

        return callback();
    });
}
