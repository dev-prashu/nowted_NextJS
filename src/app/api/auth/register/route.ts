import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing Fields !!" },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashPassword]
    );

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );

    
  } catch (error: unknown) {
    const err = error as Error;
    if ("code" in err && err.code === "23505") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
