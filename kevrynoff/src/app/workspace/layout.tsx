import React from "react";
import Sidebar from "@/components/workspace/Sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
