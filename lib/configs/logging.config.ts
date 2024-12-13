import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import winston, { createLogger, format } from 'winston';
import { CLS_LOGGING_NAMESPACE } from '../constants/cls-logging.constant';
import { DEFAULT_REQUEST_ID_HEADER } from '../constants/logging.constant';
import { LoggingConfigType } from '../types/logging.type';

const addRequestId = format((info) => {
    info[DEFAULT_REQUEST_ID_HEADER] = CLS_LOGGING_NAMESPACE.get(DEFAULT_REQUEST_ID_HEADER);
    return info;
});

export const createLoggingConfig = (config: LoggingConfigType) => {
    const serviceName = config.serviceName ? config.serviceName : 'backend-api';

    const loggerConfig = {
        level: 'info',
        format: format.combine(addRequestId(), format.timestamp(), format.json()),
        defaultMeta: { service: serviceName },
        transports: config.transports
    };
    if (config.isLocal) {
        loggerConfig.transports = [
            new winston.transports.Console({
                format: format.combine(
                    addRequestId(),
                    nestWinstonModuleUtilities.format.nestLike(serviceName, {
                        colors: true,
                        prettyPrint: true,
                        processId: true,
                        appName: true
                    })
                )
            })
        ];
    } else {
        if (!config.transports) {
            loggerConfig.transports = [
                new winston.transports.Console({
                    format: format.combine(addRequestId(), format.timestamp(), format.json())
                })
            ];
        }
    }

    return WinstonModule.createLogger({
        instance: createLogger(loggerConfig)
    });
};
