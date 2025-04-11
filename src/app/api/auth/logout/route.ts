import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "No active session found" },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );

  response.cookies.delete("token");

  return response;
}
