
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SchoolsPage from "./pages/SchoolsPage";
import FinancePage from "./pages/FinancePage";
import StudentsPage from "./pages/StudentPage";
import SchoolFinancePage from "./pages/SchoolFinancePage";
import SchoolStudentsPage from "./pages/SchoolStudentsPage";
import AddSchoolPage from "./pages/AddSchoolPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/students" element={<StudentsPage/>} />
            <Route path="/finance/:id" element={<SchoolFinancePage />} />
            <Route path="/students/:id" element={<SchoolStudentsPage/>} />
            <Route path="/add-school" element={<AddSchoolPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
