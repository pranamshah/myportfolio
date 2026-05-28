import mongoose, { Schema, Document as MDocument, Model } from "mongoose";

export interface IDocument extends MDocument {
  _id: mongoose.Types.ObjectId;
  shipment: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  name: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  category: "BL" | "INVOICE" | "PACKING_LIST" | "CUSTOMS" | "INSURANCE" | "CERTIFICATE" | "OTHER";
  description?: string;
  isVisibleToClient: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    shipment: { type: Schema.Types.ObjectId, ref: "Shipment", required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
    category: {
      type: String,
      enum: ["BL", "INVOICE", "PACKING_LIST", "CUSTOMS", "INSURANCE", "CERTIFICATE", "OTHER"],
      default: "OTHER",
    },
    description: String,
    isVisibleToClient: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShipDoc: Model<IDocument> = mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
export default ShipDoc;
