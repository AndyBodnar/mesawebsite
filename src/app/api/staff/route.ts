import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, hasStaffAccess, StaffRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffRole = (session.user.staffRole || "user") as StaffRole;
    if (!hasStaffAccess(staffRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all staff members (staff, admin, owner)
    const staffMembers = await db.user.findMany({
      where: {
        staffRole: { in: ["staff", "admin", "owner"] },
      },
      select: {
        id: true,
        name: true,
        image: true,
        staffRole: true,
      },
      orderBy: [
        { staffRole: "desc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json(staffMembers);
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}
