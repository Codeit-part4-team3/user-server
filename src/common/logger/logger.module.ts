import { Module, Global } from '@nestjs/common';
import { winstonLogger } from './winston.util';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Global()
@Module({
  providers: [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useValue: winstonLogger,
    },
  ],
  exports: [WINSTON_MODULE_PROVIDER],
})
export class LoggerModule {}
