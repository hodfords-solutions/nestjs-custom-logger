import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, firstValueFrom, from } from 'rxjs';
import { DEFAULT_REQUEST_ID_HEADER } from '../constants/logging.constant';
import { runInLogging } from '../helpers/logging.helper';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const metadata = context.switchToRpc().getContext().getMap();
        const requestId = metadata[DEFAULT_REQUEST_ID_HEADER];

        context.switchToRpc().getContext()[DEFAULT_REQUEST_ID_HEADER] = requestId;
        return runInLogging({ [DEFAULT_REQUEST_ID_HEADER]: requestId }, () => from(firstValueFrom(next.handle())));
    }
}
