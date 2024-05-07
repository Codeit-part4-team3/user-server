import { IsInt, IsString, Length, Min } from 'class-validator';

export class CreateTempOrderDto {
  @IsString()
  @Length(1, 50)
  orderName: string;

  @IsInt()
  @Min(0)
  totalAmount: number;
}
