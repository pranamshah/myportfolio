import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { numberToWords, formatINR } from "@/lib/utils";

// Helvetica is built-in to @react-pdf/renderer, no registration needed

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#111", backgroundColor: "#fff", paddingHorizontal: 36, paddingVertical: 28 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: "#111" },
  company: { flex: 1 },
  companyName: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  companyDetail: { fontSize: 8, color: "#444", lineHeight: 1.4 },
  invoiceTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", textAlign: "right", marginBottom: 4 },
  invoiceDetail: { fontSize: 8, textAlign: "right", color: "#444", lineHeight: 1.5 },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 7.5, textTransform: "uppercase", letterSpacing: 0.8, color: "#666", marginBottom: 5, fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  box: { flex: 1, marginRight: 12 },
  boxLast: { flex: 1 },
  label: { fontSize: 7.5, color: "#666", marginBottom: 2, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 9 },
  table: { marginTop: 6 },
  tableHead: { flexDirection: "row", backgroundColor: "#111", paddingVertical: 5, paddingHorizontal: 4 },
  tableHeadText: { color: "#fff", fontSize: 8, fontFamily: "Helvetica-Bold" },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e0e0e0", paddingVertical: 5, paddingHorizontal: 4 },
  tableRowAlt: { backgroundColor: "#f9f9f9" },
  col1: { flex: 4 }, col2: { flex: 1.2, textAlign: "center" }, col3: { flex: 1, textAlign: "center" },
  col4: { flex: 1.2, textAlign: "right" }, col5: { flex: 1.5, textAlign: "right" },
  totalBox: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6 },
  totalTable: { width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: "#e0e0e0" },
  totalLabel: { fontSize: 8.5, color: "#555" },
  totalValue: { fontSize: 8.5 },
  grandTotal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, backgroundColor: "#111", paddingHorizontal: 4, marginTop: 2 },
  grandLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#fff" },
  grandValue: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#fff" },
  gstTable: { marginTop: 10, borderWidth: 0.5, borderColor: "#ccc" },
  gstHead: { flexDirection: "row", backgroundColor: "#f0f0f0", paddingVertical: 4, paddingHorizontal: 3, borderBottomWidth: 0.5, borderBottomColor: "#ccc" },
  gstHeadText: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#333" },
  gstRow: { flexDirection: "row", paddingVertical: 3, paddingHorizontal: 3 },
  gstCol: { flex: 1.5 }, gstColSm: { flex: 1, textAlign: "center" }, gstColLg: { flex: 1.8, textAlign: "right" },
  amountWords: { marginTop: 12, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: "#e0e0e0" },
  amountWordsText: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  bankDetails: { marginTop: 12, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: "#e0e0e0", flexDirection: "row", justifyContent: "space-between" },
  bankBox: { flex: 1 },
  signBox: { flex: 1, alignItems: "flex-end" },
  signText: { fontSize: 8, color: "#444", textAlign: "center" },
  footerNote: { marginTop: 10, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: "#e0e0e0", fontSize: 7.5, color: "#888", textAlign: "center" },
});

interface LineItem { description: string; hsn?: string; qty: number; rate: number; amount: number; }
interface InvoiceData {
  invoiceNo: string; invoiceType: "SERVICE" | "REIMBURSEMENT"; invoiceDate: string; dueDate?: string;
  client: { name: string; company?: string; address?: string; gst?: string; email?: string; phone?: string; };
  shipment?: { shipmentId: string; description: string; blNo?: string; containerNo?: string; portOfLoading?: string; portOfDischarge?: string; vessel?: string; };
  lineItems: LineItem[]; subtotal: number; cgst?: number; sgst?: number; igst?: number; tds?: number; totalAmount: number;
  notes?: string;
}

const COMPANY = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Navkar Impex",
  address: "Old No. 9, New No. 12, Bay View Tower, Krishnan Koil Street\nChennai, Tamil Nadu - PIN Code: 600001",
  pan: "AACP0000PL1",
  gst: "33AACP0000P1ZX",
  phone: process.env.NEXT_PUBLIC_PHONE || "+91 90807 67398",
  email: process.env.NEXT_PUBLIC_EMAIL || "navkarimpex.co@gmail.com",
  bank: "State Bank of India",
  acName: "Navkar Impex",
  acNo: "1234567890",
  ifsc: "SBIN0001234",
  branch: "Chennai Main Branch",
};

export function InvoicePDF({ inv }: { inv: InvoiceData }) {
  const isReimb = inv.invoiceType === "REIMBURSEMENT";
  const cgstRate = inv.cgst && inv.subtotal ? ((inv.cgst / inv.subtotal) * 100).toFixed(2) : "9.00";
  const sgstRate = inv.sgst && inv.subtotal ? ((inv.sgst / inv.subtotal) * 100).toFixed(2) : "9.00";
  const igstRate = inv.igst && inv.subtotal ? ((inv.igst / inv.subtotal) * 100).toFixed(2) : "18.00";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.company}>
            <Text style={styles.companyName}>{COMPANY.name}</Text>
            <Text style={styles.companyDetail}>{COMPANY.address}</Text>
            <Text style={styles.companyDetail}>PAN: {COMPANY.pan} | GSTIN: {COMPANY.gst}</Text>
            <Text style={styles.companyDetail}>Ph: {COMPANY.phone} | Email: {COMPANY.email}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>{isReimb ? "REIMBURSEMENT BILL" : "TAX INVOICE"}</Text>
            <Text style={styles.invoiceDetail}>Invoice No: {inv.invoiceNo}</Text>
            <Text style={styles.invoiceDetail}>Date: {new Date(inv.invoiceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Text>
            {inv.dueDate && <Text style={styles.invoiceDetail}>Due: {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Text>}
          </View>
        </View>

        {/* Bill To / Shipment Details */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={[styles.value, { fontFamily: "Helvetica-Bold" }]}>{inv.client.name}</Text>
            {inv.client.company && <Text style={styles.value}>{inv.client.company}</Text>}
            {inv.client.address && <Text style={[styles.value, { color: "#555", lineHeight: 1.4 }]}>{inv.client.address}</Text>}
            {inv.client.gst && <Text style={[styles.label, { marginTop: 3 }]}>GSTIN: <Text style={styles.value}>{inv.client.gst}</Text></Text>}
            {inv.client.phone && <Text style={styles.companyDetail}>Ph: {inv.client.phone}</Text>}
          </View>
          {inv.shipment && (
            <View style={styles.boxLast}>
              <Text style={styles.sectionTitle}>Shipment Reference</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
                {[
                  ["Shipment ID", inv.shipment.shipmentId],
                  ["B/L No.", inv.shipment.blNo],
                  ["Container", inv.shipment.containerNo],
                  ["Port of Loading", inv.shipment.portOfLoading],
                  ["Port of Discharge", inv.shipment.portOfDischarge],
                  ["Vessel", inv.shipment.vessel],
                ].filter(([, v]) => v).map(([l, v]) => (
                  <View key={l} style={{ marginBottom: 3, width: "48%" }}>
                    <Text style={styles.label}>{l}</Text>
                    <Text style={styles.value}>{v}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadText, styles.col1]}>Description</Text>
            <Text style={[styles.tableHeadText, styles.col2]}>HSN/SAC</Text>
            <Text style={[styles.tableHeadText, styles.col3]}>Qty/No.</Text>
            <Text style={[styles.tableHeadText, styles.col4]}>Rate (₹)</Text>
            <Text style={[styles.tableHeadText, styles.col5]}>Amount (₹)</Text>
          </View>
          {inv.lineItems.map((item, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[{ fontSize: 8.5 }, styles.col1]}>{item.description}</Text>
              <Text style={[{ fontSize: 8.5, textAlign: "center" }, styles.col2]}>{item.hsn || "—"}</Text>
              <Text style={[{ fontSize: 8.5, textAlign: "center" }, styles.col3]}>{item.qty}</Text>
              <Text style={[{ fontSize: 8.5, textAlign: "right" }, styles.col4]}>{item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
              <Text style={[{ fontSize: 8.5, textAlign: "right" }, styles.col5]}>{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalBox}>
          <View style={styles.totalTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sub Total</Text>
              <Text style={styles.totalValue}>{formatINR(inv.subtotal)}</Text>
            </View>
            {inv.cgst != null && inv.cgst > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>CGST @ {cgstRate}%</Text>
                <Text style={styles.totalValue}>{formatINR(inv.cgst)}</Text>
              </View>
            )}
            {inv.sgst != null && inv.sgst > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>SGST @ {sgstRate}%</Text>
                <Text style={styles.totalValue}>{formatINR(inv.sgst)}</Text>
              </View>
            )}
            {inv.igst != null && inv.igst > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>IGST @ {igstRate}%</Text>
                <Text style={styles.totalValue}>{formatINR(inv.igst)}</Text>
              </View>
            )}
            {inv.tds != null && inv.tds > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Less: TDS</Text>
                <Text style={styles.totalValue}>-{formatINR(inv.tds)}</Text>
              </View>
            )}
            <View style={styles.grandTotal}>
              <Text style={styles.grandLabel}>TOTAL</Text>
              <Text style={styles.grandValue}>{formatINR(inv.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* GST Table */}
        {!isReimb && (inv.cgst || inv.sgst || inv.igst) ? (
          <View style={styles.gstTable}>
            <View style={styles.gstHead}>
              <Text style={[styles.gstHeadText, styles.gstCol]}>SAC</Text>
              <Text style={[styles.gstHeadText, styles.gstCol]}>Taxable Amt</Text>
              <Text style={[styles.gstHeadText, styles.gstColSm]}>CGST%</Text>
              <Text style={[styles.gstHeadText, styles.gstColSm]}>CGST Amt</Text>
              <Text style={[styles.gstHeadText, styles.gstColSm]}>SGST%</Text>
              <Text style={[styles.gstHeadText, styles.gstColSm]}>SGST Amt</Text>
              <Text style={[styles.gstHeadText, styles.gstColSm]}>IGST%</Text>
              <Text style={[styles.gstHeadText, styles.gstColSm]}>IGST Amt</Text>
              <Text style={[styles.gstHeadText, styles.gstColLg]}>Total Tax</Text>
            </View>
            <View style={styles.gstRow}>
              <Text style={[{ fontSize: 8 }, styles.gstCol]}>998599</Text>
              <Text style={[{ fontSize: 8 }, styles.gstCol]}>{formatINR(inv.subtotal)}</Text>
              <Text style={[{ fontSize: 8, textAlign: "center" }, styles.gstColSm]}>{cgstRate}%</Text>
              <Text style={[{ fontSize: 8, textAlign: "center" }, styles.gstColSm]}>{formatINR(inv.cgst || 0)}</Text>
              <Text style={[{ fontSize: 8, textAlign: "center" }, styles.gstColSm]}>{sgstRate}%</Text>
              <Text style={[{ fontSize: 8, textAlign: "center" }, styles.gstColSm]}>{formatINR(inv.sgst || 0)}</Text>
              <Text style={[{ fontSize: 8, textAlign: "center" }, styles.gstColSm]}>{igstRate}%</Text>
              <Text style={[{ fontSize: 8, textAlign: "center" }, styles.gstColSm]}>{formatINR(inv.igst || 0)}</Text>
              <Text style={[{ fontSize: 8, textAlign: "right" }, styles.gstColLg]}>{formatINR((inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0))}</Text>
            </View>
          </View>
        ) : null}

        {/* Amount in Words */}
        <View style={styles.amountWords}>
          <Text style={styles.amountWordsText}>Amount in words: {numberToWords(Math.round(inv.totalAmount))}</Text>
        </View>

        {inv.notes && (
          <View style={{ marginTop: 8 }}>
            <Text style={[styles.label]}>Notes / Remarks:</Text>
            <Text style={{ fontSize: 8, color: "#555", marginTop: 2 }}>{inv.notes}</Text>
          </View>
        )}

        {/* Bank Details */}
        <View style={styles.bankDetails}>
          <View style={styles.bankBox}>
            <Text style={[styles.sectionTitle]}>Bank Details</Text>
            <Text style={styles.companyDetail}>A/C Name: {COMPANY.acName}</Text>
            <Text style={styles.companyDetail}>Bank Name: {COMPANY.bank}</Text>
            <Text style={styles.companyDetail}>A/C No: {COMPANY.acNo}</Text>
            <Text style={styles.companyDetail}>IFSC Code: {COMPANY.ifsc}</Text>
            <Text style={styles.companyDetail}>Branch: {COMPANY.branch}</Text>
          </View>
          <View style={styles.signBox}>
            <Text style={[styles.sectionTitle, { textAlign: "right" }]}>For {COMPANY.name}</Text>
            <View style={{ height: 40, borderBottomWidth: 0.5, borderBottomColor: "#ccc", width: 120, marginTop: 8 }} />
            <Text style={styles.signText}>Authorised Signatory</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          This is a Computer Generated {isReimb ? "Bill" : "Invoice"} and does not require a signature.
          {"\n"}Subject to {inv.client.address?.includes("Chennai") ? "Chennai" : "India"} Jurisdiction.
        </Text>
      </Page>
    </Document>
  );
}
