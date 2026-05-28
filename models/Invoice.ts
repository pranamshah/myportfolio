import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILineItem {
  description: string;
  hsn?: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface IInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  invoiceNo: string;
  invoiceType: "SERVICE" | "REIMBURSEMENT";
  shipment?: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  invoiceDate: Date;
  dueDate?: Date;
  lineItems: ILineItem[];
  subtotal: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  tds?: number;
  totalAmount: number;
  amountPaid: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  notes?: string;
  paymentMethod?: string;
  paymentDate?: Date;
  paymentRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LineItemSchema = new Schema<ILineItem>(
  {
    description: { type: String, required: true },
    hsn: String,
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNo: { type: String, required: true, unique: true },
    invoiceType: { type: String, enum: ["SERVICE", "REIMBURSEMENT"], required: true },
    shipment: { type: Schema.Types.ObjectId, ref: "Shipment" },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: Date,
    lineItems: [LineItemSchema],
    subtotal: { type: Number, required: true },
    cgst: Number,
    sgst: Number,
    igst: Number,
    tds: Number,
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"], default: "DRAFT" },
    notes: String,
    paymentMethod: String,
    paymentDate: Date,
    paymentRef: String,
  },
  { timestamps: true }
);

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;
