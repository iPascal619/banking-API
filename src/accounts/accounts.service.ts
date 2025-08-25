import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountStatus } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccount(user: User, dto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      accountNumber: dto.accountNumber,
      user,
      balance: 0,
      status: AccountStatus.ACTIVE,
    });
    return this.accountRepository.save(account);
  }

  async getAccountsForUser(userId: string): Promise<Account[]> {
    return this.accountRepository.find({ where: { user: { id: userId } } });
  }

  async getAccountById(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async updateAccountStatus(
    id: string,
    dto: UpdateAccountStatusDto,
  ): Promise<Account> {
    const account = await this.getAccountById(id);
    account.status = dto.status;
    return this.accountRepository.save(account);
  }
}
