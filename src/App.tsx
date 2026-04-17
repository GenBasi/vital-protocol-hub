import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import ProcedureDetail from "./pages/ProcedureDetail";
import RunProcedure from "./pages/RunProcedure";
import Troubleshooting from "./pages/Troubleshooting";
import ProcedureEditor from "./pages/ProcedureEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/procedures" element={<Library />} />
            <Route path="/procedures/new" element={<ProcedureEditor />} />
            <Route path="/procedures/:id" element={<ProcedureDetail />} />
            <Route path="/procedures/:id/edit" element={<ProcedureEditor />} />
            <Route path="/procedures/:id/run" element={<RunProcedure />} />
            <Route path="/troubleshooting" element={<Troubleshooting />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
