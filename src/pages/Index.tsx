
import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/PageTransition";
import { GlassContainer } from "@/components/ui/glass-container";
import { FileText, ArrowRight, CheckCircle } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  
  const features = [
    "Professional invoice templates",
    "Automated calculations",
    "Client management",
    "Tax handling",
    "Export to PDF",
    "Print-ready documents",
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navbar />
        
        <div className="container max-w-screen-xl pt-32 pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            <div className="flex-1 space-y-6 animate-slide-up">
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
                  Professional invoices,{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    effortlessly
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mt-4">
                  Create beautiful, customizable invoices in seconds. Streamline your billing process and get paid faster.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="group"
                  onClick={() => navigate("/invoice")}
                >
                  <span>Create Invoice</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <GlassContainer 
                className="p-5 rounded-2xl shadow-xl w-full max-w-md transform hover:scale-[1.01] transition-all duration-300"
              >
                <div className="bg-primary/5 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-primary">INVOICE</h3>
                      <p className="text-sm text-muted-foreground">INV-2023092001</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Client:</span>
                      <span className="text-sm font-medium">Acme Inc.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="text-sm font-mono font-medium">$1,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="text-sm font-medium text-primary">Pending</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Due Date:</span>
                      <span className="text-sm font-medium">Oct 15, 2023</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate("/invoice")}
                >
                  Create New Invoice
                </Button>
              </GlassContainer>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {features.map((feature, index) => (
              <GlassContainer 
                key={index}
                className="p-5 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-base">{feature}</p>
                </div>
              </GlassContainer>
            ))}
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <GlassContainer className="p-8 max-w-xl">
              <h2 className="text-2xl font-semibold mb-2">Ready to streamline your invoicing?</h2>
              <p className="text-muted-foreground mb-6">
                Create your first professional invoice in minutes. No sign-up required.
              </p>
              <Button 
                size="lg" 
                className="group"
                onClick={() => navigate("/invoice")}
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </GlassContainer>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
