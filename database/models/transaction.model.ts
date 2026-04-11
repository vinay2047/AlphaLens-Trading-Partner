import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface ITransaction extends Document {
    userId: string;
    type: 'DEPOSIT' | 'BUY' | 'SELL';
    symbol?: string;
    company?: string;
    shares?: number;
    pricePerShare?: number;
    totalAmount: number;
    stripePaymentId?: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: { type: String, required: true, index: true },
        type: { type: String, enum: ['DEPOSIT', 'BUY', 'SELL'], required: true },
        symbol: { type: String, uppercase: true, trim: true },
        company: { type: String, trim: true },
        shares: { type: Number, min: 0 },
        pricePerShare: { type: Number, min: 0 },
        totalAmount: { type: Number, required: true },
        stripePaymentId: { type: String },
        status: { type: String, enum: ['COMPLETED', 'PENDING', 'FAILED'], default: 'COMPLETED' },
    },
    { timestamps: true }
);

// Index for efficient transaction history queries
TransactionSchema.index({ userId: 1, createdAt: -1 });

export const Transaction: Model<ITransaction> =
    (models?.Transaction as Model<ITransaction>) || model<ITransaction>('Transaction', TransactionSchema);
