import { pool } from "@/lib/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decodeJwt(token!).id as string;
    const result = await pool.query("SELECT * FROM folders WHERE userId = $1 AND deletedAt IS NULL ORDER BY createdAt DESC", [
      userId,
    ]);

    const folders = result.rows.map(folder => ({
      id: folder.folderid,
      name: folder.name,
      createdAt: folder.createdat,
      updatedAt: folder.updatedat,
      deletedAt: folder.deletedat
    }));
    return NextResponse.json({ folders: folders });
  } catch (error) {
    console.log("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decodeJwt(token!).id as string;
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT * FROM folders WHERE userId = $1 AND name = $2 AND deletedat IS NULL",
      [userId, name]
    );

    if (result.rows.length > 0) {
      return NextResponse.json(
        { error: "Folder with this name already exists" },
        { status: 409 }
      );
    }
    await pool.query("INSERT INTO folders(name,userId) VALUES ($1,$2)", [
      name,
      userId,
    ]);

    return NextResponse.json({ message: "Folder created successfully" });
  } catch (error) {
    console.log("Error creating folder:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
