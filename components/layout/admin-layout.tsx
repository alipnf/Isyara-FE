"use client";

import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

