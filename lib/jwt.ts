import { SignJWT, jwtVerify } from "jose";

// Fallback secret for development if an env variable is missing
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_SKILLSPRINT_KEY_31564696";

// Convert secret string to a Uint8Array format required by `jose`
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  id: string;
  email: string;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Set token expiry to 7 days
    .sign(encodedSecret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    // Return null if token is expired or invalid
    return null;
  }
}
