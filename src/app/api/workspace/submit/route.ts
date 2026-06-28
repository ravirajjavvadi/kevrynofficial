import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const body = await request.json();
    const { taskId, githubUrl, deployUrl } = body;

    if (!taskId || !githubUrl) {
      return NextResponse.json({ error: "MISSING_DATA" }, { status: 400 });
    }

    const db = await getDb();

    // Update the task status and add submission data in the interns collection
    const result = await db.collection("interns").updateOne(
      { email: email, "tasks.id": taskId },
      { 
        $set: { 
          "tasks.$.status": "under_review",
          "tasks.$.submission": {
            github: githubUrl,
            deploy: deployUrl,
            timestamp: new Date()
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "TASK_OR_INTERN_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("[WORKSPACE_SUBMISSION_ERROR]", err);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
