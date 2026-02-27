import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaystackService } from './paystack.service.js';

@Controller('payments/paystack')
export class PaystackController {
    constructor(private readonly paystackService: PaystackService) {}

    @Get('public-key')
    getPublicKey() {
        return { publicKey: this.paystackService.getPublicKey() };
    }


    @Post('initialize')
    async initializePayment(@Body() body: { email: string; amount: number; reference?: string; callbackUrl?: string; metadata?: Record<string, any> }) {
        return this.paystackService.initializeTransaction({
            email: body.email,
            amount: body.amount,
            reference: body.reference,
            metadata: {source: 'nestjs'},
        });
    }

    @Get('verify/:reference')
    async verifyPayment(@Param('reference') reference: string) {
        return this.paystackService.verifyTransaction(reference);
    }
}
