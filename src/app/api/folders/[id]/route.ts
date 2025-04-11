import { pool } from "@/lib/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get("token")?.value;
    const body = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decodeJwt(token).id as string;
    const { name } = body;
    const folderId = params.id;
    if (!name) {
      return NextResponse.json({ error: "Name is Requires" }, { status: 400 });
    }
    await pool.query(
      "UPDATE folders SET name= $1 WHERE folderid = $2 AND userid = $3",
      [name, folderId, userId]
    );
    return NextResponse.json(
      { message: "Folder Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Updating Folder", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decodeJwt(token).id as string;
    const folderId = params.id;

    await client.query("BEGIN");

    await client.query(
      `UPDATE folders SET deletedat = NOW() WHERE folderid = $1 AND userid = $2`,
      [folderId, userId]
    );

    await client.query(
      "UPDATE notes SET deletedat = NOW() WHERE folderid = $1 AND userid = $2",
      [folderId, userId]
    );

    await client.query("COMMIT");

    return NextResponse.json({ message: "Folder deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting folder and notes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
