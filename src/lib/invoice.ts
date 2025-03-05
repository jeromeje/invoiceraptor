
export interface LineItemData {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  fromCompany: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  toClient: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  items: LineItemData[];
  notes: string;
  terms: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export function calculateLineItemAmount(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function calculateSubtotal(items: LineItemData[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function calculateTaxAmount(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  return subtotal + taxAmount;
}

// Default empty invoice
export const emptyInvoice: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  date: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  fromCompany: {
    name: "Your Company Name",
    address: "123 Business St, Suite 100\nSan Francisco, CA 94111",
    email: "contact@yourcompany.com",
    phone: "(555) 123-4567"
  },
  toClient: {
    name: "Client Name",
    address: "456 Client Ave\nNew York, NY 10001",
    email: "client@example.com",
    phone: "(555) 987-6543"
  },
  items: [
    {
      id: "item-1",
      description: "Design Services",
      quantity: 1,
      unitPrice: 1000,
      amount: 1000
    }
  ],
  notes: "Thank you for your business!",
  terms: "Payment due within 30 days of issue date.",
  subtotal: 1000,
  taxRate: 8.25,
  taxAmount: 82.5,
  total: 1082.5
};

function generateInvoiceNumber(): string {
  const prefix = "INV";
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${dateStr}-${random}`;
}
