import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Transaction } from './transaction.entity';

@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, { eager: true })
  account: Account;

  @ManyToOne(() => Transaction, { eager: true })
  transaction: Transaction;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column()
  isCredit: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
