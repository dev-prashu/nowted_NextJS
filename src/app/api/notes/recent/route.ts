import { pool } from "@/lib/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const payload = decodeJwt(token!);
    const userId = payload.id as string;

    const result = await pool.query(
      "SELECT * FROM notes WHERE userid = $1 AND deletedAt IS NULL ORDER BY updatedAt DESC LIMIT 3",
      [userId]
    );

    return NextResponse.json({ recentNotes: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
