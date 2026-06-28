import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());

    const db = await getDb();
    
    // Search by any of the user's emails
    const intern = await db.collection("interns").findOne({ 
      $or: [
        { email: { $in: emails } },
        { internId: { $in: emails } } // Support if internId was somehow set to email
      ]
    });

    if (!intern) {
      return NextResponse.json({ error: "NOT_REGISTERED", emailsChecked: emails }, { status: 404 });
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
