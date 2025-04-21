import { pool } from "@/lib/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const payload = decodeJwt(token);
    const userId = payload.id as string;

    // First get the recent notes
    const notesResult = await pool.query(
      "SELECT * FROM notes WHERE userid = $1 AND deletedat IS NULL ORDER BY updatedat DESC LIMIT 3",
      [userId]
    );

    // Get all unique folder IDs from the notes
    const folderIds = [...new Set(notesResult.rows.map(note => note.folderid))].filter(id => id);

    // Fetch all folders in a single query
    let folders = [];
    if (folderIds.length > 0) {
      const foldersResult = await pool.query(
        "SELECT * FROM folders WHERE folderid = ANY($1)",
        [folderIds]
      );
      folders = foldersResult.rows;
    }

    // Create a folder map for quick lookup
    const folderMap = new Map(folders.map(folder => [folder.folderid, folder]));

    // Transform notes to camelCase and include folder details
    const recentNotes = notesResult.rows.map(note => {
      const folder = note.folderid ? folderMap.get(note.folderid) : null;

      return {
        id: note.noteid,
        folderId: note.folderid,
        title: note.title,
        isFavorite: note.isfavorite,
        isArchived: note.isarchived,
        createdAt: note.createdat,
        updatedAt: note.updatedat,
        deletedAt: note.deletedat,
        preview: note.content?.substring(0, 15) || '', 
        folder: folder ? {
          id: folder.folderid,
          name: folder.name,
          createdAt: folder.createdat,
          updatedAt: folder.updatedat,
          deletedAt: folder.deletedat
        } : null
      };
    });

    return NextResponse.json({ recentNotes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}