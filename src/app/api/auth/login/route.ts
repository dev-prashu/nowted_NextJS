import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const result = await pool.query("Select * from users where email=$1 ", [
      email,
    ]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User Not Exist" }, { status: 401 });
    }
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }
    const token = await new SignJWT({
      id: user.userid,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(ACCESS_SECRET));

    const response = NextResponse.json(
      { message: "Login Successfull" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
