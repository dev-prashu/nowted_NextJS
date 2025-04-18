import { pool } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const noteId=  params.id;
  try {
    const noteResult = await pool.query("SELECT * FROM notes WHERE noteid = $1", [noteId]);

    if (noteResult.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const note = noteResult.rows[0];

    const folderResult = await pool.query("SELECT * FROM folders WHERE folderid = $1", [note.folderid]);

    if (folderResult.rows.length > 0) {
      note.folder = folderResult.rows[0];
    }

    return NextResponse.json({ note }, { status: 200 });

  }catch (error) {
    console.log("Unable to fetch note by id", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { folderId, title, content, isFavorite, isArchived } =
      await req.json();

    const noteId = params.id;

    if (!folderId || !title) {
      return NextResponse.json(
        { error: "folderId and title are required" },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE notes SET folderId = $1,title = $2,content = $3,isFavorite = $4,isArchived = $5,updatedAt=now() WHERE noteid = $6",
      [folderId, title, content, isFavorite, isArchived, noteId]
    );
    return NextResponse.json(
      { message: "Note Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating note", error);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    await pool.query(
      "UPDATE notes SET deletedAt=now() WHERE noteId=$1 ",
      [noteId]
    );
    return NextResponse.json(
      { message: "Note Deleted Successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
