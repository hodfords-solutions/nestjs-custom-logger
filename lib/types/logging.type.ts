import * as Transport from 'winston-transport';

export type LoggingConfigType = {
    serviceName?: string;
    transports?: Transport[] | Transport;
    isLocal?: boolean;
};
