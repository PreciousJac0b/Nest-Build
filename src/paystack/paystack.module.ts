import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service.js';
import { PaystackController } from './paystack.controller.js';
import { HttpService } from '@nestjs/axios';

@Module({
  providers: [PaystackService, HttpService],
  controllers: [PaystackController]
})
export class PaystackModule {}
