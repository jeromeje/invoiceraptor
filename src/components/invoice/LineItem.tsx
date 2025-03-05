import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LineItemData, calculateLineItemAmount } from "@/lib/invoice";
import { cn } from "@/lib/utils";

interface LineItemProps {
  item: LineItemData;
  onChange: (updatedItem: LineItemData) => void;
  onRemove: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function LineItem({ item, onChange, onRemove, className, style }: LineItemProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof LineItemData
  ) => {
    let value: string | number = e.target.value;
    
    if (field === "quantity" || field === "unitPrice") {
      value = parseFloat(value) || 0;
      
      const updatedItem = {
        ...item,
        [field]: value,
      };
      
      // Recalculate amount when quantity or unit price changes
      updatedItem.amount = calculateLineItemAmount(
        field === "quantity" ? value : item.quantity,
        field === "unitPrice" ? value : item.unitPrice
      );
      
      onChange(updatedItem);
    } else {
      onChange({
        ...item,
        [field]: value,
      });
    }
  };

  return (
    <div style={style} className={cn("grid grid-cols-12 gap-2 items-center", className)}>
      <div className="col-span-5 sm:col-span-6">
        <Input
          placeholder="Description"
          value={item.description}
          onChange={(e) => handleChange(e, "description")}
          className="bg-background/50"
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Qty"
          value={item.quantity || ""}
          onChange={(e) => handleChange(e, "quantity")}
          className="bg-background/50 text-center"
        />
      </div>
      <div className="col-span-3">
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={item.unitPrice || ""}
          onChange={(e) => handleChange(e, "unitPrice")}
          className="bg-background/50 text-right"
        />
      </div>
      <div className="col-span-1 sm:col-span-0.5 flex justify-end items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={16} />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
}
