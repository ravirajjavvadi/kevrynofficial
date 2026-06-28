import React from "react";
import Sidebar from "@/components/workspace/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());

  // 1. Identity Verification Guard: Sovereign Lockdown (Strict Mode)
  try {
    const db = await getDb();
    // Only allow access if the intern exists in the official MongoDB registry
    const intern = await db.collection("interns").findOne({ 
      $or: [
        { email: { $in: emails } },
        { internId: { $in: emails } }
      ]
    });
    
    if (!intern) {
      // No registry entry found. Absolute block.
      console.warn(`[SECURITY] Unauthorized Workspace Access Blocked for emails: ${emails.join(", ")}`);
      redirect("/unauthorized");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) throw error;
    console.error("[SECURITY_GUARD_FAILURE]", error);
    redirect("/unauthorized");
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
