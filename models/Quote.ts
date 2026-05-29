import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuote extends Document {
  _id: mongoose.Types.ObjectId;
  quoteNo: string;
  client: mongoose.Types.ObjectId;
  origin: string;
  destination: string;
  cargoType: string;
  incoterms?: string;
  weight?: number;
  cbm?: number;
  packages?: number;
  commodity?: string;
  additionalServices?: string[];
  remarks?: string;
  quotedAmount?: number;
  validUntil?: Date;
  status: "PENDING" | "QUOTED" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    quoteNo: { type: String, required: true, unique: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cargoType: { type: String, required: true },
    incoterms: String,
    weight: Number,
    cbm: Number,
    packages: Number,
    commodity: String,
    additionalServices: [String],
    remarks: String,
    quotedAmount: Number,
    validUntil: Date,
    status: { type: String, enum: ["PENDING", "QUOTED", "ACCEPTED", "REJECTED", "EXPIRED"], default: "PENDING" },
    adminNotes: String,
  },
  { timestamps: true }
);

const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);
export default Quote;
