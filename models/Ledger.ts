import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILedger extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  group: string;
  type: "ASSET" | "LIABILITY" | "INCOME" | "EXPENSE" | "EQUITY";
  openingBalance: number;
  openingType: "DR" | "CR";
  description?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LedgerSchema = new Schema<ILedger>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    group: { type: String, required: true },
    type: { type: String, enum: ["ASSET", "LIABILITY", "INCOME", "EXPENSE", "EQUITY"], required: true },
    openingBalance: { type: Number, default: 0 },
    openingType: { type: String, enum: ["DR", "CR"], default: "DR" },
    description: String,
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Ledger: Model<ILedger> = mongoose.models.Ledger || mongoose.model<ILedger>("Ledger", LedgerSchema);
export default Ledger;
