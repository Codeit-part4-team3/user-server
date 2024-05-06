import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateTempOrderDto {
  @IsString()
  @Length(1, 50)
  orderName: string;

  @IsInt()
  @Min(0)
  pointAmount: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  couponAmount: number;

  @IsInt()
  @Min(0)
  totalAmount: number;
}
