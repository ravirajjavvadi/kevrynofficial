import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });
    }

    const intern = await db.intern.findUnique({
      where: { id },
      include: {
        submissions: true,
      },
    });

    if (!intern) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(intern);
  } catch (err: any) {
    console.error("[INTERN FETCH ERROR]", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
