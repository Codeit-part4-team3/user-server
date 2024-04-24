import { Module, Global } from '@nestjs/common';
import { winstonLogger } from './winston.util';

@Global()
@Module({
  providers: [
    {
      provide: 'WinstonLogger',
      useValue: winstonLogger,
    },
  ],
  exports: ['WinstonLogger'],
})
export class LoggerModule {}
