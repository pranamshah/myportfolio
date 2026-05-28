import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShipment extends Document {
  _id: mongoose.Types.ObjectId;
  shipmentId: string;
  client: mongoose.Types.ObjectId;
  description: string;
  origin: string;
  destination: string;
  portOfLoading: string;
  portOfDischarge: string;
  vessel?: string;
  voyageNo?: string;
  blNo?: string;
  containerNo?: string;
  sealNo?: string;
  packages?: number;
  grossWeight?: number;
  cbm?: number;
  commodity?: string;
  incoterms?: string;
  status: string;
  etd?: Date;
  eta?: Date;
  actualDeparture?: Date;
  actualArrival?: Date;
  notes?: string;
  timeline: { status: string; date: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    shipmentId: { type: String, required: true, unique: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    portOfLoading: { type: String, default: "" },
    portOfDischarge: { type: String, default: "" },
    vessel: String,
    voyageNo: String,
    blNo: String,
    containerNo: String,
    sealNo: String,
    packages: Number,
    grossWeight: Number,
    cbm: Number,
    commodity: String,
    incoterms: String,
    status: { type: String, default: "BOOKING_CONFIRMED" },
    etd: Date,
    eta: Date,
    actualDeparture: Date,
    actualArrival: Date,
    notes: String,
    timeline: [
      {
        status: { type: String, required: true },
        date: { type: Date, required: true },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

const Shipment: Model<IShipment> = mongoose.models.Shipment || mongoose.model<IShipment>("Shipment", ShipmentSchema);
export default Shipment;
