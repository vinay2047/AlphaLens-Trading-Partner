import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IPortfolio extends Document {
    userId: string;
    balance: number;
    totalInvested: number;
    createdAt: Date;
    updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
    {
        userId: { type: String, required: true, unique: true, index: true },
        balance: { type: Number, default: 0, min: 0 },
        totalInvested: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

export const Portfolio: Model<IPortfolio> =
    (models?.Portfolio as Model<IPortfolio>) || model<IPortfolio>('Portfolio', PortfolioSchema);
