# Electronic Invoice Management

A TypeScript backend platform for loyalty operations, gift cards, coupons, and invoicing-related workflows.

## Overview

This service provides:

- private and public HTTP endpoints via the internal routing framework,
- MongoDB-based data access through a centralized driver layer,
- scheduled jobs for birthday-based coupon distribution,
- email delivery with HTML/PDF templates for loyalty and gift-card communications.

## Tech Stack

- Node.js + TypeScript
- MongoDB
- HyperExpress
- Fastest Validator
- Nodemailer
- html-pdf-node

## Project Structure

- `handlers/`: route handlers (public and private)
- `middlewares/`: request validation and pre-handler checks
- `drivers/`: MongoDB connection and domain logic
- `utils/`: reusable helpers, validators, templates, and mail utilities
- `cron/`: scheduled background jobs
- `server/`: server bootstrap and route generation artifacts

## Requirements

- Node.js 18+
- MongoDB instance
- Environment file at `./.env`

## Installation

1. Install dependencies:
      - `npm install`
2. Configure environment variables in `.env`.
3. Start the application using your preferred TypeScript runtime (for example):
      - `npx ts-node-dev app.ts`

## Runtime Flow

At startup, the application:

1. loads environment variables,
2. connects to MongoDB and exposes drivers in `globalThis.metadriver`,
3. initializes server routes,
4. starts cron jobs,
5. writes generated routes to `server/routes.json`,
6. listens on `PORT` (default: `5000`).

## Language & Naming Policy

This repository uses professional English terminology for:

- user-facing validation messages,
- comments and logs,
- local variable names and internal symbols.

Backward compatibility aliases are preserved where legacy field names may still exist in stored data.

## Notes

- Do not modify internal framework files under `_framework/` unless framework-level changes are explicitly required.
