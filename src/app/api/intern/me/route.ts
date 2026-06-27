import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "NO_EMAIL_FOUND" }, { status: 400 });
    }

    const db = await getDb();
    const intern = await db.collection("interns").findOne({ email: email });

    if (!intern) {
      return NextResponse.json({ error: "NOT_REGISTERED" }, { status: 404 });
    }

    // Map _id to id for consistency
    return NextResponse.json({
      ...intern,
      id: intern._id
    });

  } catch (err: any) {
    console.error("[INTERNAL_ME_ERROR]", err);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
