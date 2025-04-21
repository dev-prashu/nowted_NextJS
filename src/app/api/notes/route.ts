import { pool } from "@/lib/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    const userId = decodeJwt(token).id as string;
    const { searchParams } = new URL(req.url);
    const isArchived = searchParams.get("archived");
    const isFavorite = searchParams.get("favorite");
    const folderId = searchParams.get("folderId");
    const deleted = searchParams.get("deleted"); 
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;
    const params: string[] = [userId];
    let paramIndex = 2;

    let query = "SELECT * FROM notes WHERE userid = $1";

    // Handle deletedAt logic first (your core requirement)
    if (deleted !== null) {
      // Only if 'deleted' param is explicitly passed
      query += ` AND deletedAt IS ${deleted === "true" ? "NOT NULL" : "NULL"}`;
    } else {
      // Default case: Always enforce deletedAt IS NULL unless 'deleted' is specified
      query += ` AND deletedAt IS NULL`;
    }

    // Other filters (unchanged)
    if (folderId !== null) {
      query += ` AND folderid = $${paramIndex++}`;
      params.push(folderId);
    }
    if (isFavorite !== null) {
      query += ` AND isfavorite = $${paramIndex++}`;
      params.push(isFavorite === "true" ? "true" : "false");
    }
    if (isArchived !== null) {
      query += ` AND isarchived = $${paramIndex++}`;
      params.push(isArchived === "true" ? "true" : "false");
    }
    if (search !== null && search !== "") {
      query += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      params.push("%" + search + "%");
      paramIndex++;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;
   

    const result = await pool.query(query, params);

    const notes = result.rows.map((row) => ({
      id: row.noteid,
      folderId: row.folderid,
      title: row.title,
      content: row.content,
      isFavorite: row.isfavorite,
      isArchived: row.isarchived,
      createdAt: row.createdat,
      updatedAt: row.updatedat,
      deletedAt: row.deletedat,
      preview: row.content.substring(0, 15),
    }));

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId, title, content, isFavorite, isArchived } =
      await req.json();

      console.log("folderId:", folderId, "title:", title, "content:", content, "isFavorite:", isFavorite, "isArchived:", isArchived);
    // if (!folderId || !title || !content || !isFavorite || !isArchived) {
    //   return NextResponse.json(
    //     { error: "Invalid Request Body" },
    //     { status: 400 }
    //   );
    // }
    const userId = decodeJwt(token).id as string;

    const existingNote = await pool.query(
      "SELECT * FROM NOTES WHERE folderid = $1 AND userid = $2 AND title = $3 AND deletedAt IS NULL",
      [folderId, userId, title]
    );
    if (existingNote.rows.length > 0) {
      return NextResponse.json(
        { error: "Note with this title already exists" },
        { status: 409 }
      );
    }

    const result = await pool.query(
      "INSERT INTO NOTES(folderId,title,content,isFavorite,isArchived,userid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [folderId, title, content, isFavorite, isArchived, userId]
    );

    return NextResponse.json({ id: result.rows[0].noteid }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
