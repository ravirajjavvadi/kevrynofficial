import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  '___KarsaTek OS_ADMIN_EMAIL___'
];

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());
    const isAdmin = emails.some(email => ADMIN_WHITELIST.includes(email));

    if (!isAdmin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const db = await getDb();
    const memories = await db.collection("company_memory")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(memories);
  } catch (err: any) {
    console.error("[GET_MEMORY_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());
    const isAdmin = emails.some(email => ADMIN_WHITELIST.includes(email));

    if (!isAdmin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const { candidateId, name, role, stage, score, feedback, retained = true, exitReason = "" } = body;

    if (!name || !role || !stage) {
      return NextResponse.json({ error: "MISSING_DATA" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("company_memory").insertOne({
      candidateId,
      name,
      role,
      stage,
      score: Number(score) || 5,
      feedback,
      retained,
      exitReason,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("[POST_MEMORY_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
