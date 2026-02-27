import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PaystackResponse } from './paystack.types.js';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaystackService {
    private readonly secretKey: string;
    private readonly baseUrl: string;

    constructor(
        private config: ConfigService,
        private readonly http: HttpService
    ) {
        this.secretKey = this.config.get<string>('PAYSTACK_SECRET_TEST_KEY') || '';
        this.baseUrl = this.config.get<string>('PAYSTACK_BASE_URL') || 'https://api.paystack.co';

        if (this.secretKey === '') {
            throw new Error('PAYSTACK_SECRET_TEST_KEY is not set in environment variables');
        }
    }


    private authHeaders() {
        return {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
        };
    }

    async initializeTransaction(params: {
        email: string,
        amount: number,
        reference?: string,
        callbackUrl?: string,
        metadata?: Record<string, any>
    }) {
        if (!params.email || !params.amount) {
            throw new BadRequestException('Email and amount are required to initialize a transaction');
        }

        const payload = {
            email: params.email,
            amount: params.amount * 100,
            reference: params.reference,
            callback_url: params.callbackUrl,
            metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
        };

        const res = await firstValueFrom(this.http.post<PaystackResponse<{ authorization_url: string; access_code: string; reference: string }>>(
            `${this.baseUrl}/transaction/initialize`,
            payload,
            { headers: this.authHeaders() },
        ),
        );

        return res.data;
    }

    async verifyTransaction(reference: string) {
        if (!reference) {
            throw new BadRequestException('Reference is required to verify a transaction');
        }

        const res = await firstValueFrom(
            this.http.get<PaystackResponse<any>>(
                `${this.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`, // :contentReference[oaicite:9]{index=9}
                { headers: this.authHeaders() },
            ),
        );

        // const res = await firstValueFrom(this.http.get<PaystackResponse<{ status: string; reference: string; amount: number; currency: string; metadata: Record<string, any> }>>(
        //     `${this.baseUrl}/transaction/verify/${reference}`,
        //     { headers: this.authHeaders() },
        // ),
        // );

        return res.data;
    }

    getPublicKey() {
        const publicKey = this.config.get<string>('PAYSTACK_PUBLIC_TEST_KEY');
        if (!publicKey) {
            throw new Error('PAYSTACK_PUBLIC_TEST_KEY is not set in environment variables');
        }
        return publicKey;
    }
}
