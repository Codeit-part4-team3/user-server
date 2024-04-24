import { utilities, WinstonModule } from 'nest-winston';
import winstonDaily from 'winston-daily-rotate-file';
import winston from 'winston';
import moment from 'moment-timezone';
import appRoot from 'app-root-path';

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format();
  }
  return info;
});

// 로그 저장 파일 옵션
const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD', // 날짜 포맷
    dirname: `${appRoot.path}/logs` + `/${level}`, // 저장할 URL: 여기서는  루트에 logs라는 폴더가 생기고 그 아래에 level 폴더
    filename: `%DATE%.${level}.log`,
    maxFiles: 20, // 20일의 로그 저장
    zippedArchive: true, // 로그가 쌓였을 때 압축
    colorize: true, // 로그 메세지에 색상 추가
    handleExceptions: true, // 로거가 애플리케이션에서 발생하는 예외를 자동으로 감지해 기록
    json: false, // JSON 형식이 아닌 일반 텍스트 형식으로 출력
  };
};

// 로거 설정
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    // 콘솔 출력 옵션 지정
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        utilities.format.nestLike('pq-user-server', {
          prettyPrint: true, // 로그를 더 읽기 쉽게 정리해 출력
        }),
      ),
    }),
    // info, error, fatal 로그는 파일로 관리
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('error')),
    new winstonDaily(dailyOptions('fatal')),
  ],
  // 포멧 지정
  format: winston.format.combine(
    appendTimestamp({ tz: 'Asia/Seoul' }), // 로그 서울 시간대를 기준으로 기록
    winston.format.json(),
    winston.format.printf((info) => {
      return `${info.timestamp} - ${info.level} ${info.message}`;
    }),
  ),
});
