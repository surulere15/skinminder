"use client";

import React from "react";
import { ScanHealthDashboard } from "@/features/admin/components/scan-health-dashboard";

export default function AdminHealthPage() {
  return (
    <main className="min-h-screen bg-background">
      <ScanHealthDashboard />
    </main>
  );
}
