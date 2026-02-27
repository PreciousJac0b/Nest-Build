import { Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';

@Controller('payments/paystack')
export class PaystackWebhookController {
    constructor(private readonly configService: ConfigService) {}

    @Post('webhook')
    handleWebhook(@Req() req: Request, @Res() res: Response) {
        const secret = this.configService.get<string>('PAYSTACK_WEBHOOK_SECRET') || '';
        const signature = req.headers['x-paystack-signature'] as string;

        const rawBody = (req as any).rawBody;
        const hash = crypto
            .createHmac('sha512', secret)
            .update(rawBody)
            .digest('hex');

        if (!signature || hash !== signature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const event = JSON.parse(rawBody.toString('utf8'));

        res.status(200).json({ message: 'Webhook received successfully' });
    }
}