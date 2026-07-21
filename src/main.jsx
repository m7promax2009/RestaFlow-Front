import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./i18n";
import "./index.css";

import { store } from "./app/store";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

function SuspenseFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-400">Yuklanmoqda...</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<SuspenseFallback />}>
            <App />
          </Suspense>
          <ToastContainer position="top-right" />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);