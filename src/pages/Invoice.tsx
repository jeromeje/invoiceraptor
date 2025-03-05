
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { InvoiceData, emptyInvoice } from "@/lib/invoice";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Desktop, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Invoice() {
  const [invoice, setInvoice] = useState<InvoiceData>(emptyInvoice);
  const [activeTab, setActiveTab] = useState("edit");
  const isMobile = useIsMobile();

  const handleInvoiceChange = (updatedInvoice: InvoiceData) => {
    setInvoice(updatedInvoice);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navbar />
        
        <div className="container max-w-screen-xl pt-28 pb-16">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground mt-2">
              Fill out the form to create a professional invoice for your clients
            </p>
          </div>
          
          <Tabs
            defaultValue="edit"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Desktop size={16} />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Smartphone size={16} />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {!isMobile || activeTab === "edit" ? (
                <TabsContent value="edit" className="flex-1 m-0">
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    <div className="pr-4">
                      <InvoiceForm invoice={invoice} onChange={handleInvoiceChange} />
                    </div>
                  </ScrollArea>
                </TabsContent>
              ) : null}
              
              {!isMobile || activeTab === "preview" ? (
                <TabsContent value="preview" className="flex-1 m-0">
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    <div className="pr-4 pb-20">
                      <InvoicePreview invoice={invoice} />
                    </div>
                  </ScrollArea>
                </TabsContent>
              ) : null}
            </div>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
