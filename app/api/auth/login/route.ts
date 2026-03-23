import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = db.prepare("SELECT * FROM user WHERE email = ?").get(email) as
      | { id: string; email: string; password: string }
      | undefined

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please sign up first." },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    const token = await signToken({ id: user.id, email: user.email })
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
    })
  } catch (error) {
    console.error("[LOGIN]", error)
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    )
  }
}
