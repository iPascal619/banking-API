import { IsNotEmpty, IsEnum, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { TransactionType } from '../transaction.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsUUID()
  fromAccountId: string;

  @IsOptional()
  @IsUUID()
  toAccountId?: string;
}
