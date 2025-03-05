
import React, { useRef } from "react";
import { InvoiceData } from "@/lib/invoice";
import { GlassContainer } from "../ui/glass-container";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import { Download, Printer } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useReactToPrint } from "react-to-print";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  className?: string;
}

export function InvoicePreview({ invoice, className }: InvoicePreviewProps) {
  const { toast } = useToast();
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${invoice.invoiceNumber}`,
    onAfterPrint: () => {
      toast({
        title: "Print successful",
        description: "Your invoice has been sent to your printer.",
      });
    },
    // The content function is what gets printed
    contentRef: componentRef,
  });

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your invoice PDF is being generated...",
    });
    
    // For now, just trigger print to PDF
    handlePrint();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Preview</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleDownload}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handlePrint()}
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>
      
      <GlassContainer 
        className="p-8 max-w-[850px] mx-auto overflow-hidden animate-scale-in"
        intensity="light"
        ref={componentRef}
      >
        <div className="w-full" id="invoice-preview">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">INVOICE</h1>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {format(new Date(invoice.date), "MMMM d, yyyy")}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span>{" "}
                  {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-1">{invoice.fromCompany.name}</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="whitespace-pre-line">{invoice.fromCompany.address}</p>
                <p>{invoice.fromCompany.email}</p>
                <p>{invoice.fromCompany.phone}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Bill To
            </h2>
            <div className="bg-secondary/40 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-1">{invoice.toClient.name}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="whitespace-pre-line">{invoice.toClient.address}</p>
                <p>{invoice.toClient.email}</p>
                <p>{invoice.toClient.phone}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Invoice Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary/40 text-sm">
                    <th className="text-left py-3 px-4 rounded-tl-md">#</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-center py-3 px-4">Quantity</th>
                    <th className="text-right py-3 px-4">Unit Price</th>
                    <th className="text-right py-3 px-4 rounded-tr-md">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-border/50 text-sm hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-10">
            <div className="w-60">
              <div className="flex justify-between py-2">
                <span className="text-sm">Subtotal:</span>
                <span className="font-mono">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm">Tax ({invoice.taxRate}%):</span>
                <span className="font-mono">${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 font-semibold">
                <span>Total:</span>
                <span className="font-mono">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Notes
              </h2>
              <div className="bg-secondary/20 p-4 rounded-md whitespace-pre-line">
                {invoice.notes}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Terms & Conditions
              </h2>
              <div className="bg-secondary/20 p-4 rounded-md whitespace-pre-line">
                {invoice.terms}
              </div>
            </div>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
}
