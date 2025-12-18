export interface AddressDetails {
  name: string;
  addressLine1: string;
  addressLine2: string;
  gstin: string;
  mobile: string;
  email?: string;
  state: string; // Place of Supply
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  unit: string; // e.g., PCS, KGS
  rate: number;
  taxRate: number; // Percentage, e.g., 5 for 5%
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  dueDate: string;
  seller: AddressDetails;
  buyer: AddressDetails; // Bill To
  consignee: AddressDetails; // Ship To
  items: InvoiceItem[];
  terms: string[];
  signatureName: string;
}

export const INITIAL_INVOICE: InvoiceData = {
  invoiceNo: "130",
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  seller: {
    name: "TRIAKSHA STONE STUDIO",
    addressLine1: "No 1, Ground floor, 9th E main road",
    addressLine2: "Vijayanagar Bengaluru 560040",
    gstin: "29BNWPN1919B1Z0",
    mobile: "8296578444",
    email: "Triakshastonestudio@gmail.com",
    state: "Karnataka"
  },
  buyer: {
    name: "SN CONSTRUCTION",
    addressLine1: "#14(S) 1st Stage 2nd Phase opp to HDFC Bank Chandra layout",
    addressLine2: "Bangalore, 560053",
    gstin: "29ABTFS0493H1ZI",
    mobile: "9741698149",
    state: "Karnataka"
  },
  consignee: {
    name: "SN CONSTRUCTION",
    addressLine1: "#14(S) 1st Stage 2nd Phase opp to HDFC Bank Chandra layout",
    addressLine2: "Bangalore, 560053",
    gstin: "",
    mobile: "",
    state: "Karnataka"
  },
  items: [
    {
      id: "1",
      description: "WET MIX (GSB)\njigani",
      hsn: "251710",
      quantity: 48.95,
      unit: "PCS",
      rate: 700,
      taxRate: 5
    }
  ],
  terms: [
    "Goods once sold will not be taken back or exchanged",
    "All disputes are subject to Bangalore jurisdiction only"
  ],
  signatureName: "TRIAKSHA STONE STUDIO"
};