# Banking API

A comprehensive banking API built with NestJS, TypeScript, and TypeORM. This system provides secure banking operations with double-entry ledger accounting, user authentication, and account management.

## Features

- **Authentication**: JWT-based user registration and login
- **Account Management**: Create and manage bank accounts with status controls
- **Transaction System**: Deposit, withdrawal, and transfer operations with double-entry ledger
- **Audit Trail**: Complete transaction history with pagination
- **Security**: Input validation, password hashing, and JWT protection
- **Documentation**: Auto-generated Swagger API documentation

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: TypeORM with SQLite (configurable for PostgreSQL)
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest (unit tests)

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
# Start in development mode with hot reload
npm run start:dev

# Build the project
npm run build

# Start in production mode
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Accounts
- `POST /accounts` - Create new account
- `GET /accounts` - List user accounts
- `PATCH /accounts/:id/status` - Update account status (admin)

### Transactions
- `POST /transactions` - Create deposit/withdrawal/transfer
- `GET /transactions` - Transaction history with pagination

## API Documentation

Access the Swagger documentation at: `http://localhost:3000/api`

## Database Schema

The system implements a proper double-entry ledger with the following entities:
- **Users**: Customer and admin user accounts
- **Accounts**: Bank accounts linked to users
- **Transactions**: Financial transactions (deposit, withdrawal, transfer)
- **LedgerEntries**: Double-entry accounting records

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- Account status management

## Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

This project is MIT licensed.
