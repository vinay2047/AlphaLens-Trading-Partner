import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IDCAPlan extends Document {
    userId: string;
    symbol: string;
    company: string;
    amount: number;          // USD amount per purchase
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    active: boolean;
    nextExecutionAt: Date;
    totalExecuted: number;   // count of successful purchases
    totalInvested: number;   // cumulative USD spent
    createdAt: Date;
    updatedAt: Date;
}

const DCAPlanSchema = new Schema<IDCAPlan>(
    {
        userId: { type: String, required: true, index: true },
        symbol: { type: String, required: true, uppercase: true, trim: true },
        company: { type: String, required: true, trim: true },
        amount: { type: Number, required: true, min: 1 },
        frequency: { type: String, enum: ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'], required: true },
        active: { type: Boolean, default: true },
        nextExecutionAt: { type: Date, required: true },
        totalExecuted: { type: Number, default: 0 },
        totalInvested: { type: Number, default: 0 },
    },
    { timestamps: true }
);

DCAPlanSchema.index({ userId: 1, symbol: 1 }, { unique: true });
DCAPlanSchema.index({ active: 1, nextExecutionAt: 1 });

export const DCAPlan: Model<IDCAPlan> =
    (models?.DCAPlan as Model<IDCAPlan>) || model<IDCAPlan>('DCAPlan', DCAPlanSchema);
