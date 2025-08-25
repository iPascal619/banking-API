import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { LedgerEntry } from './ledger-entry.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Account } from '../accounts/account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(LedgerEntry)
    private readonly ledgerRepo: Repository<LedgerEntry>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const { type, amount, fromAccountId, toAccountId } = dto;
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const fromAccount = await this.accountRepo.findOne({ where: { id: fromAccountId } });
    if (!fromAccount) throw new NotFoundException('From account not found');
    let toAccount: Account | null = null;
    if (type === TransactionType.TRANSFER) {
      if (!toAccountId) throw new BadRequestException('To account required for transfer');
      toAccount = await this.accountRepo.findOne({ where: { id: toAccountId } });
      if (!toAccount) throw new NotFoundException('To account not found');
    }
    if ((type === TransactionType.WITHDRAW || type === TransactionType.TRANSFER) && fromAccount.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Transaction creation
    const transaction = this.transactionRepo.create({
      type,
      amount,
      fromAccount,
      toAccount,
    });
    await this.transactionRepo.save(transaction);

    // Double-entry ledger
    if (type === TransactionType.DEPOSIT) {
      fromAccount.balance += amount;
      await this.accountRepo.save(fromAccount);
      await this.ledgerRepo.save(this.ledgerRepo.create({
        account: fromAccount,
        transaction,
        amount,
        isCredit: true,
      }));
    } else if (type === TransactionType.WITHDRAW) {
      fromAccount.balance -= amount;
      await this.accountRepo.save(fromAccount);
      await this.ledgerRepo.save(this.ledgerRepo.create({
        account: fromAccount,
        transaction,
        amount,
        isCredit: false,
      }));
    } else if (type === TransactionType.TRANSFER && toAccount) {
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      await this.accountRepo.save(fromAccount);
      await this.accountRepo.save(toAccount);
      await this.ledgerRepo.save(this.ledgerRepo.create({
        account: fromAccount,
        transaction,
        amount,
        isCredit: false,
      }));
      await this.ledgerRepo.save(this.ledgerRepo.create({
        account: toAccount,
        transaction,
        amount,
        isCredit: true,
      }));
    }
    return transaction;
  }

  async getTransactions(accountId: string, page = 1, limit = 10) {
    return this.transactionRepo.find({
      where: [
        { fromAccount: { id: accountId } },
        { toAccount: { id: accountId } },
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
