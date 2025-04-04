"use client";

import { Switch, Route } from "wouter";
import { queryClient } from "../lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast"; // Import your custom ToastProvider
import Home from "./../pages/Home";
import PropertyDetail from "@/pages/PropertyDetail";
import Compare from "@/pages/Compare";
import About from "@/pages/About";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/compare" component={Compare} />
          <Route path="/about" component={About} />
          {/* <Route component={NotFound} /> */}
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router />
        <Toast />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
