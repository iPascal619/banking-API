import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { Account } from './account.entity';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 201, description: 'Account created.' })
  async create(
    @Request() req,
    @Body() dto: CreateAccountDto,
  ): Promise<Account> {
    return this.accountsService.createAccount(req.user, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'List user accounts.' })
  async findAll(@Request() req): Promise<Account[]> {
    return this.accountsService.getAccountsForUser(req.user.id);
  }

  @Patch(':id/status')
  @ApiBody({ type: UpdateAccountStatusDto })
  @ApiResponse({ status: 200, description: 'Account status updated.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAccountStatusDto,
  ): Promise<Account> {
    return this.accountsService.updateAccountStatus(id, dto);
  }
}
