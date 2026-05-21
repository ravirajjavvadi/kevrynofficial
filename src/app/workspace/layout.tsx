import React from "react";
import Sidebar from "@/components/workspace/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  'kevryntech@gmail.com'
];

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";

  if (!user) {
    redirect("/");
  }

  // 1. Identity Verification Guard: Sovereign Lockdown
  const isAdmin = ADMIN_WHITELIST.includes(email.toLowerCase());
  
  if (!isAdmin) {
    try {
      const db = await getDb();
      // Only allow access if the intern exists in the official MongoDB registry
      const intern = await db.collection("interns").findOne({ email: email.toLowerCase() });
      
      if (!intern) {
        // If candidate is not in the recognized registry, block workspace entry
        console.warn(`[SECURITY] Unauthorized Workspace Access Blocked for ${email}`);
        redirect("/");
      }
    } catch (error) {
      console.error("[SECURITY_GUARD_FAILURE]", error);
      // Fail-secure: If DB check fails, redirect to protect the workspace
      redirect("/");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Stage */}
      <main className="flex-1 overflow-y-auto relative bg-[#050505]">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none neural-grid opacity-[0.03] z-0" />
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
        
        {/* Content Area */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
