import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import "../index.css";
import { queryClient } from "./lib/query-client";
import { AppShell } from "./components/layout/AppShell";
import DashboardPage from "./routes/dashboard";
import DecisionPointsPage from "./routes/decision-points";
import NewDecisionPointPage from "./routes/decision-points/new";
import DecisionPointDetailPage from "./routes/decision-points/detail";
import OversightRecordsPage from "./routes/oversight-records";
import NewOversightRecordPage from "./routes/oversight-records/new";
import OversightRecordDetailPage from "./routes/oversight-records/detail";
import EvidenceTrailPage from "./routes/evidence-trail";
import EvidenceExportsPage from "./routes/evidence-exports";
import EvidenceExportDetailPage from "./routes/evidence-exports/detail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "decision-points", element: <DecisionPointsPage /> },
      { path: "decision-points/new", element: <NewDecisionPointPage /> },
      { path: "decision-points/:id", element: <DecisionPointDetailPage /> },
      { path: "oversight-records", element: <OversightRecordsPage /> },
      { path: "oversight-records/new", element: <NewOversightRecordPage /> },
      { path: "oversight-records/:id", element: <OversightRecordDetailPage /> },
      { path: "evidence-trail", element: <EvidenceTrailPage /> },
      { path: "evidence-exports", element: <EvidenceExportsPage /> },
      { path: "evidence-exports/:id", element: <EvidenceExportDetailPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
