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
    const logs = await db.collection("audit_logs")
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    // Aggregates for savings
    const summary = await db.collection("audit_logs").aggregate([
      {
        $group: {
          _id: null,
          totalSaved: { $sum: "$costSaved" },
          totalCost: { $sum: "$actualCost" },
          totalCalls: { $count: {} }
        }
      }
    ]).toArray();

    return NextResponse.json({
      logs,
      totals: summary[0] || { totalSaved: 0, totalCost: 0, totalCalls: 0 }
    });
  } catch (err: any) {
    console.error("[GET_AUDIT_LOGS_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
