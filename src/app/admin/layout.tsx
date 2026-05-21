import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  'kevryntech@gmail.com'
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";

  // 1. Server-Side Admin Guard
  if (!user || !ADMIN_WHITELIST.includes(email.toLowerCase())) {
    redirect("/");
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#020202] flex overflow-hidden">
      {/* Admin Sidebar (Client Component) */}
      <AdminSidebar />

      {/* Main Admin Stage */}
      <main className="flex-1 overflow-y-auto relative bg-[#020202]">
        <div className="absolute inset-0 pointer-events-none neural-grid opacity-[0.04] z-0" />
        <div className="relative z-10 p-8 lg:p-12 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
