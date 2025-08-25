import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountStatus } from '../account.entity';

export class UpdateAccountStatusDto {
  @IsNotEmpty()
  @IsEnum(AccountStatus)
  status: AccountStatus;
}
