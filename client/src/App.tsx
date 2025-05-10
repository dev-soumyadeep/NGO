
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
import CentralInventory from "./pages/CentralInventory";
import CategoryPage from "./pages/CategoryPage";
import InventoryPage from "./pages/InventoryPage";
import SchoolInventoryPage from "./pages/schoolInventoryPage";
import CentralFinance from "./pages/CentralFinance";
import TrackItemPurchase from "./pages/TrackItemPurchase";
import AlumniPage from "./pages/AlumniPage";
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
            <Route path="/inventory" element={<InventoryPage/>} />
            <Route path="/inventory/:id" element={<SchoolInventoryPage/>} />
            <Route path="/finance/:id" element={<SchoolFinancePage />} />
            <Route path="/students/:id" element={<SchoolStudentsPage/>} />
            <Route path="/add-school" element={<AddSchoolPage />} />
            <Route path="/central-inventory" element={<CentralInventory />} />
            <Route path="/central-inventory/:id" element={<CategoryPage />} />
            <Route path="/central-finance" element={<CentralFinance />} />
            <Route path="/track-item-purchase" element={<TrackItemPurchase />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
