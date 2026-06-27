import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  'kevryntech@gmail.com'
];

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;

    if (!email || !ADMIN_WHITELIST.includes(email.toLowerCase())) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const db = await getDb();
    const interns = await db.collection("interns")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(interns);

  } catch (err: any) {
    console.error("[ADMIN_INTERNS_ERROR]", err);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
