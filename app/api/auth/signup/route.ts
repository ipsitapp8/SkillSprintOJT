import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = db.prepare("SELECT id FROM user WHERE email = ?").get(email) as
      | { id: string }
      | undefined

    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered. Please login instead." },
        { status: 409 }
      )
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const id = crypto.randomUUID()

    db.prepare("INSERT INTO user (id, email, password) VALUES (?, ?, ?)").run(
      id,
      email,
      hashedPassword
    )

    const cookieStore = await cookies()
    const token = await signToken({ id, email })
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return NextResponse.json({
      id,
      email,
    })
  } catch (error) {
    console.error("[SIGNUP]", error)
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    )
  }
}
