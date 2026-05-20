export default function Verify() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 rounded-full bg-brand/10 blur-xl absolute" />
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 relative z-10">Certificate Verification</h1>
      <p className="text-xl text-muted max-w-2xl relative z-10">This module is part of Phase 8+ and will allow cryptographic verification of KevRyn credentials via ID.</p>
    </div>
  )
}
