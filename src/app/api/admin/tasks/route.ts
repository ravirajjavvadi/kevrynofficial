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
    
    // Aggregate tasks from all interns
    const interns = await db.collection("interns").find({}).toArray();
    
    const allTasks = interns.flatMap((intern: any) => 
      (intern.tasks || []).map((task: any) => ({
        ...task,
        assignedTo: intern.name,
        internId: intern.internId || intern._id,
        email: intern.email
      }))
    );

    // Sort by assignment time descending
    allTasks.sort((a: any, b: any) => {
      const dateA = new Date(a.assignedAt || 0).getTime();
      const dateB = new Date(b.assignedAt || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(allTasks);

  } catch (err: any) {
    console.error("[ADMIN_TASKS_GET_ERROR]", err);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
