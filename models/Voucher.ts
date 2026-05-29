import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVoucherEntry {
  ledger: mongoose.Types.ObjectId;
  ledgerName: string;
  type: "DR" | "CR";
  amount: number;
  narration?: string;
}

export interface IVoucher extends Document {
  _id: mongoose.Types.ObjectId;
  voucherNo: string;
  voucherType: "SALES" | "PURCHASE" | "RECEIPT" | "PAYMENT" | "JOURNAL" | "CONTRA" | "CREDIT_NOTE" | "DEBIT_NOTE";
  date: Date;
  narration: string;
  entries: IVoucherEntry[];
  totalAmount: number;
  reference?: string;
  attachments?: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VoucherEntrySchema = new Schema<IVoucherEntry>(
  {
    ledger: { type: Schema.Types.ObjectId, ref: "Ledger", required: true },
    ledgerName: { type: String, required: true },
    type: { type: String, enum: ["DR", "CR"], required: true },
    amount: { type: Number, required: true },
    narration: String,
  },
  { _id: false }
);

const VoucherSchema = new Schema<IVoucher>(
  {
    voucherNo: { type: String, required: true, unique: true },
    voucherType: {
      type: String,
      enum: ["SALES", "PURCHASE", "RECEIPT", "PAYMENT", "JOURNAL", "CONTRA", "CREDIT_NOTE", "DEBIT_NOTE"],
      required: true,
    },
    date: { type: Date, required: true },
    narration: { type: String, required: true },
    entries: [VoucherEntrySchema],
    totalAmount: { type: Number, required: true },
    reference: String,
    attachments: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Voucher: Model<IVoucher> = mongoose.models.Voucher || mongoose.model<IVoucher>("Voucher", VoucherSchema);
export default Voucher;
