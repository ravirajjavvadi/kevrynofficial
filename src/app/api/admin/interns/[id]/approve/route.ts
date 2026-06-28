import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getSelectionEmail } from "@/lib/email-templates";
import nodemailer from "nodemailer";

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  '___KarsaTek OS_ADMIN_EMAIL___'
];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const db = await getDb();

    // Find intern record
    const intern = await db.collection("interns").findOne({ _id: id as any });

    if (!intern) {
      return NextResponse.json({ error: "CANDIDATE_NOT_FOUND" }, { status: 404 });
    }

    // Generate a secure temporary password
    const tempPwd = "KR-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "!";
    let clerkUserId = intern.clerkId || null;

    // 1. CLERK IDENTITY PROVISIONING (Only if not already created)
    if (!clerkUserId) {
      try {
        const clerkRes = await fetch("https://api.clerk.com/v1/users", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email_address: [intern.email],
            password: tempPwd,
            first_name: intern.name.split(' ')[0],
            last_name: intern.name.split(' ').slice(1).join(' '),
            public_metadata: { clearance: 3, role: "intern", internId: id }
          })
        });

        if (clerkRes.ok) {
          const clerkData = await clerkRes.json();
          clerkUserId = clerkData.id;
          console.log("[WAR ROOM APPROVAL] Clerk Identity Generated:", clerkUserId);
        } else {
          const errMsg = await clerkRes.text();
          console.error("[WAR ROOM CLERK ERROR]", errMsg);
          return NextResponse.json({ error: "CLERK_PROVISIONING_FAILED", message: errMsg }, { status: 500 });
        }
      } catch (authErr: any) {
        console.error("[IDENTITY FAILURE] Could not reach Clerk API:", authErr);
        return NextResponse.json({ error: "CLERK_API_UNREACHABLE", message: authErr.message }, { status: 500 });
      }
    }

    // 2. UPDATE STATUS IN MONGODB
    await db.collection("interns").updateOne(
      { _id: id as any },
      { 
        $set: { 
          status: "ADMITTED",
          clerkId: clerkUserId,
          approvedAt: new Date()
        } 
      }
    );

    // 3. SEND SELECTION EMAIL
    try {
      const host = request.headers.get("origin") || "https://___KarsaTek OS_OFF_REPO___.vercel.app";
      const offerUrl = `${host}/offer?id=${id}`;
      const workspaceUrl = `${host}/workspace`;

      const emailHtml = getSelectionEmail(intern.name, intern.role, workspaceUrl, offerUrl, id, tempPwd);

      await transporter.sendMail({
        from: `"KarsaTek OS HireOS" <${process.env.EMAIL_USER}>`,
        to: intern.email, 
        subject: `[HIREOS] Offer and Credentials Confirmation: ${intern.role}`,
        html: emailHtml,
      });
      console.log(`[ONBOARDING EMAIL] Confirmation dispatched to ${intern.email}`);
    } catch (emailErr) {
      console.error("[ONBOARDING EMAIL ERROR] Dispatched Failed:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[APPROVE_CANDIDATE_ERROR]", err);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR", message: err.message }, { status: 500 });
  }
}
