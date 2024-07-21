import { Document } from 'mongoose';

export interface OTP extends Document {
    readonly userId: any;
    readonly otp: string;
}

