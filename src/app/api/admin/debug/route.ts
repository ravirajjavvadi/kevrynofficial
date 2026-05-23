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
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!user || !email || !ADMIN_WHITELIST.includes(email.toLowerCase())) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const db = await getDb();
    const interns = await db.collection("interns").find({}).toArray();
    
    return NextResponse.json(interns.map(i => ({
      name: i.name,
      email: i.email,
      internId: i.internId,
      tasks: i.tasks
    })));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
