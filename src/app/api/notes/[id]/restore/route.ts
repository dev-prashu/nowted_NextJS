import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    const restoredNote = await pool.query(
      "UPDATE notes SET deletedAt=NULL WHERE noteid=$1 RETURNING *",
      [noteId]
    );

    await pool.query("UPDATE folders SET deletedAt=NULL where folderid=$1", [
      restoredNote.rows[0].folderId,
    ]);
    return NextResponse.json(
      { message: "Notes Restore Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unable to restore note", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
