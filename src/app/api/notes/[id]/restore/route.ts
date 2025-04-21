import { pool } from "@/lib/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const noteId = params.id;
//     const restoredNote = await pool.query(
//       "UPDATE notes SET deletedAt=NULL WHERE noteid=$1 RETURNING *",
//       [noteId]
//     );

//     await pool.query("UPDATE folders SET deletedAt=NULL where folderid=$1", [
//       restoredNote.rows[0].folderId,
//     ]);
//     return NextResponse.json(
//       { message: "Notes Restore Successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Unable to restore note", error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    const token = req.cookies.get("token")?.value;
    const userId = decodeJwt(token!).id as string;

    
    const noteResult = await pool.query(
      "SELECT folderId, title FROM notes WHERE noteId = $1",
      [noteId]
    );

    if (noteResult.rows.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const { folderid: originalFolderId, title: noteTitle } = noteResult.rows[0];

    
    const folderResult = await pool.query(
      "SELECT name FROM folders WHERE folderId = $1",
      [originalFolderId]
    );

    if (folderResult.rows.length === 0) {
      return NextResponse.json({ error: "Original folder not found" }, { status: 404 });
    }

    const folderName = folderResult.rows[0].name;

    
    const folderCheck = await pool.query(
      "SELECT * FROM folders WHERE name = $1 AND userId = $2 AND deletedAt IS NULL",
      [folderName, userId]
    );

    if (folderCheck.rows.length > 0) {
      const existingFolderId = folderCheck.rows[0].folderid;


      const duplicateNote = await pool.query(
        "SELECT * FROM notes WHERE folderId = $1 AND title = $2 AND deletedAt IS NULL",
        [existingFolderId, noteTitle]
      );

      if (duplicateNote.rows.length > 0) {
        return NextResponse.json(
          { error: "A note with the same title already exists in the destination folder." },
          { status: 409 }
        );
      }


      await pool.query(
        "UPDATE notes SET deletedAt = NULL, folderId = $1 WHERE noteId = $2",
        [existingFolderId, noteId]
      );

      return NextResponse.json(
        { message: `Note restored successfully to existing folder ${folderName}` },
        { status: 200 }
      );
    } else {
     
      await pool.query(
        "UPDATE folders SET deletedAt = NULL WHERE folderId = $1",
        [originalFolderId]
      );

      
      await pool.query(
        "UPDATE notes SET deletedAt = NULL WHERE noteId = $1",
        [noteId]
      );

      return NextResponse.json(
        { message: `Note and its original folder ${folderName} restored successfully` },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Unable to restore note", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



//650f095f-d979-4c5c-9721-fe37a0ee22c3 [Restore Folder]

/*
 Test Note 1 : 0a317c41-b1c8-4d61-9956-e98e334d953c
 Test Note 2 : 8be66cf8-9367-4215-a1a0-7e247da2f2c0
 Test Note 3 : 8be66cf8-9367-4215-a1a0-7e247da2f2c0
 */