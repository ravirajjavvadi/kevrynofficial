import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });
    }

    const db = await getDb();
    
    // Find intern by our custom ID (mapped to _id in Mongo)
    const intern = await db.collection("interns").findOne({ _id: id as any });

    if (!intern) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(intern);
  } catch (err: any) {
    console.error("[INTERN FETCH ERROR]", err);
    return NextResponse.json(
      { 
        error: "INTERNAL_ERROR", 
        message: err.message, 
        debug_env: process.env.DATABASE_URL ? "SET" : "MISSING",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
      },
      { status: 500 }
    );
  }
}
