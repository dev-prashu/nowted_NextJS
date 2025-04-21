import { pool } from "@/lib/db";
import { decodeJwt } from "jose";

import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const noteId = params.id;
  try {
    const noteResult = await pool.query(
      "SELECT * FROM notes WHERE noteid = $1", 
      [noteId]
    );

    if (noteResult.rows.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const noteRow = noteResult.rows[0];
    let folder = null;

    if (noteRow.folderid) {
      const folderResult = await pool.query(
        "SELECT * FROM folders WHERE folderid = $1", 
        [noteRow.folderid]
      );

      if (folderResult.rows.length > 0) {
        const folderRow = folderResult.rows[0];
        folder = {
          id: folderRow.folderid,
          name: folderRow.name,
          createdAt: folderRow.createdat,
          updatedAt: folderRow.updatedat,
          deletedAt: folderRow.deletedat
        };
      }
    }

    const note = {
      id: noteRow.noteid,
      folderId: noteRow.folderid,
      title: noteRow.title,
      content: noteRow.content,
      isFavorite: noteRow.isfavorite,
      isArchived: noteRow.isarchived,
      createdAt: noteRow.createdat,
      updatedAt: noteRow.updatedat,
      deletedAt: noteRow.deletedat,
      folder: folder
    };

    return NextResponse.json({ note }, { status: 200 });
  } catch (error) {
    console.log("Unable to fetch note by id", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { folderId, title, content, isFavorite, isArchived } = await req.json();

    const noteId = params.id;
    const token = req.cookies.get("token")?.value;
    const userId = decodeJwt(token!).id as string;

    if (!folderId || !title || !content) {
      return NextResponse.json(
        { error: "folderId, title, and content are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT noteid FROM notes WHERE folderId = $1 AND title = $2 AND userId = $3 AND deletedAt IS NULL ",
      [folderId, title, userId]
    );

    if (result.rows.length > 0 && result.rows[0].noteid !== noteId) {
      return NextResponse.json(
        { error: "Note with this title already exists" },
        { status: 409 }
      );
    }

    await pool.query(
      "UPDATE notes SET folderId = $1, title = $2, content = $3, isFavorite = $4, isArchived = $5, updatedAt = now() WHERE noteid = $6",
      [folderId, title, content, isFavorite, isArchived, noteId]
    );

    return NextResponse.json(
      { message: "Note Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating note", error);
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
    await pool.query("UPDATE notes SET deletedAt=now() WHERE noteId=$1 ", [
      noteId,
    ]);
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
