import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Index } from "@/pages/Index"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useIsMobile as useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient()

const App = () => {
  const isMobile = useIsMobile();
  return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                </Routes>
                {/* <TooltipProvider> */}
                {/* <Toaster /> */}

                {/* <Sonner /> */}
                {/* </TooltipProvider> */}
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
