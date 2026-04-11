import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IHolding extends Document {
    userId: string;
    symbol: string;
    company: string;
    shares: number;
    avgBuyPrice: number;
    totalInvested: number;
    createdAt: Date;
    updatedAt: Date;
}

const HoldingSchema = new Schema<IHolding>(
    {
        userId: { type: String, required: true, index: true },
        symbol: { type: String, required: true, uppercase: true, trim: true },
        company: { type: String, required: true, trim: true },
        shares: { type: Number, required: true, min: 0 },
        avgBuyPrice: { type: Number, required: true, min: 0 },
        totalInvested: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

// One holding record per user per stock
HoldingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Holding: Model<IHolding> =
    (models?.Holding as Model<IHolding>) || model<IHolding>('Holding', HoldingSchema);
