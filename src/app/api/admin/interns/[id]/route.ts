import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  'kevryntech@gmail.com'
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!user || !email || !ADMIN_WHITELIST.includes(email.toLowerCase())) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDb();
    
    // Attempt to find by ID or Email if ID is complex
    let intern;
    try {
      intern = await db.collection("interns").findOne({ _id: new ObjectId(id) });
    } catch {
      // Fallback to searching by email if ID is not a valid ObjectId (e.g. legacy lookup)
      intern = await db.collection("interns").findOne({ email: id });
    }

    if (!intern) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(intern);

  } catch (err: any) {
    console.error("[ADMIN_INTERN_DETAIL_ERROR]", err);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: err.message },
      { status: 500 }
    );
  }
}

// POST to update intern data or assign tasks
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!user || !email || !ADMIN_WHITELIST.includes(email.toLowerCase())) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = await getDb();

    const updateDoc = {
      $set: { ...body, updatedAt: new Date() }
    };

    let result;
    try {
      result = await db.collection("interns").updateOne(
        { _id: new ObjectId(id) },
        updateDoc
      );
    } catch {
      result = await db.collection("interns").updateOne(
        { email: id },
        updateDoc
      );
    }

    return NextResponse.json({ success: true, result });

  } catch (err: any) {
    console.error("[ADMIN_INTERN_UPDATE_ERROR]", err);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
