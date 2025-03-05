
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Calculator, CalendarIcon } from "lucide-react";
import { LineItem } from "./LineItem";
import { 
  InvoiceData, 
  LineItemData, 
  calculateSubtotal, 
  calculateTaxAmount, 
  calculateTotal,
  emptyInvoice 
} from "@/lib/invoice";
import { GlassContainer } from "../ui/glass-container";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  invoice: InvoiceData;
  onChange: (invoice: InvoiceData) => void;
  className?: string;
}

export function InvoiceForm({ invoice, onChange, className }: InvoiceFormProps) {
  const [localInvoice, setLocalInvoice] = useState<InvoiceData>(invoice || emptyInvoice);

  useEffect(() => {
    // Recalculate derived values when invoice changes
    const subtotal = calculateSubtotal(localInvoice.items);
    const taxAmount = calculateTaxAmount(subtotal, localInvoice.taxRate);
    const total = calculateTotal(subtotal, taxAmount);

    if (subtotal !== localInvoice.subtotal || 
        taxAmount !== localInvoice.taxAmount || 
        total !== localInvoice.total) {
      const updatedInvoice = {
        ...localInvoice,
        subtotal,
        taxAmount,
        total
      };
      setLocalInvoice(updatedInvoice);
      onChange(updatedInvoice);
    }
  }, [localInvoice.items, localInvoice.taxRate]);

  const handleChange = (field: string, value: any) => {
    const paths = field.split('.');
    let updatedInvoice = { ...localInvoice };

    if (paths.length === 1) {
      updatedInvoice = {
        ...updatedInvoice,
        [field]: value
      };
    } else {
      let current: any = updatedInvoice;
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      current[paths[paths.length - 1]] = value;
    }

    setLocalInvoice(updatedInvoice);
    onChange(updatedInvoice);
  };

  const handleItemChange = (index: number, updatedItem: LineItemData) => {
    const updatedItems = [...localInvoice.items];
    updatedItems[index] = updatedItem;
    
    handleChange('items', updatedItems);
  };

  const handleAddItem = () => {
    const newItem: LineItemData = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    
    handleChange('items', [...localInvoice.items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (localInvoice.items.length <= 1) return;
    
    const updatedItems = localInvoice.items.filter((_, i) => i !== index);
    handleChange('items', updatedItems);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <GlassContainer className="p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="invoiceNumber" className="text-sm font-medium">
              Invoice Number
            </Label>
            <Input
              id="invoiceNumber"
              value={localInvoice.invoiceNumber}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              className="bg-background/50 mt-1"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal bg-background/50",
                      !localInvoice.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localInvoice.date ? (
                      format(new Date(localInvoice.date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(localInvoice.date)}
                    onSelect={(date) => date && handleChange('date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal bg-background/50",
                      !localInvoice.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localInvoice.dueDate ? (
                      format(new Date(localInvoice.dueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(localInvoice.dueDate)}
                    onSelect={(date) => date && handleChange('dueDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* From Company Section */}
      <GlassContainer className="p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="mb-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            From
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fromCompanyName" className="text-sm font-medium">
              Company Name
            </Label>
            <Input
              id="fromCompanyName"
              value={localInvoice.fromCompany.name}
              onChange={(e) => handleChange('fromCompany.name', e.target.value)}
              className="bg-background/50 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fromCompanyAddress" className="text-sm font-medium">
              Address
            </Label>
            <Textarea
              id="fromCompanyAddress"
              value={localInvoice.fromCompany.address}
              onChange={(e) => handleChange('fromCompany.address', e.target.value)}
              className="bg-background/50 mt-1 resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromCompanyEmail" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="fromCompanyEmail"
                type="email"
                value={localInvoice.fromCompany.email}
                onChange={(e) => handleChange('fromCompany.email', e.target.value)}
                className="bg-background/50 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fromCompanyPhone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="fromCompanyPhone"
                value={localInvoice.fromCompany.phone}
                onChange={(e) => handleChange('fromCompany.phone', e.target.value)}
                className="bg-background/50 mt-1"
              />
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* To Client Section */}
      <GlassContainer className="p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="mb-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Bill To
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="toClientName" className="text-sm font-medium">
              Client Name
            </Label>
            <Input
              id="toClientName"
              value={localInvoice.toClient.name}
              onChange={(e) => handleChange('toClient.name', e.target.value)}
              className="bg-background/50 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="toClientAddress" className="text-sm font-medium">
              Address
            </Label>
            <Textarea
              id="toClientAddress"
              value={localInvoice.toClient.address}
              onChange={(e) => handleChange('toClient.address', e.target.value)}
              className="bg-background/50 mt-1 resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="toClientEmail" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="toClientEmail"
                type="email"
                value={localInvoice.toClient.email}
                onChange={(e) => handleChange('toClient.email', e.target.value)}
                className="bg-background/50 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="toClientPhone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="toClientPhone"
                value={localInvoice.toClient.phone}
                onChange={(e) => handleChange('toClient.phone', e.target.value)}
                className="bg-background/50 mt-1"
              />
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Line Items Section */}
      <GlassContainer className="p-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="mb-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Items
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5 sm:col-span-6">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-medium text-muted-foreground text-center block">Quantity</Label>
            </div>
            <div className="col-span-3">
              <Label className="text-xs font-medium text-muted-foreground text-right block">Price</Label>
            </div>
            <div className="col-span-2 sm:col-span-1"></div>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto subtle-scroll pr-1">
            {localInvoice.items.map((item, index) => (
              <LineItem
                key={item.id}
                item={item}
                onChange={(updatedItem) => handleItemChange(index, updatedItem)}
                onRemove={() => handleRemoveItem(index)}
                className="animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="w-full mt-2 bg-background/50 border-dashed hover:border-solid transition-all"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>

          <Separator className="my-4" />

          <div className="space-y-2 ml-auto w-full max-w-[240px]">
            <div className="flex justify-between">
              <Label className="text-sm">Subtotal:</Label>
              <span className="font-mono">
                ${localInvoice.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <Label className="text-sm" htmlFor="taxRate">
                Tax Rate (%):
              </Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                value={localInvoice.taxRate || ""}
                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                className="bg-background/50 w-20 text-right h-8"
              />
            </div>

            <div className="flex justify-between">
              <Label className="text-sm">Tax Amount:</Label>
              <span className="font-mono">
                ${localInvoice.taxAmount.toFixed(2)}
              </span>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between text-lg font-semibold">
              <Label>Total:</Label>
              <span className="font-mono">
                ${localInvoice.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Notes and Terms Section */}
      <GlassContainer className="p-5 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={localInvoice.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="bg-background/50 mt-1 h-28 resize-none"
              placeholder="Additional notes for the client..."
            />
          </div>

          <div>
            <Label htmlFor="terms" className="text-sm font-medium">
              Terms & Conditions
            </Label>
            <Textarea
              id="terms"
              value={localInvoice.terms}
              onChange={(e) => handleChange('terms', e.target.value)}
              className="bg-background/50 mt-1 h-28 resize-none"
              placeholder="Payment terms and conditions..."
            />
          </div>
        </div>
      </GlassContainer>
    </div>
  );
}
