import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function adminGuard() {
    const session = await auth()

    if (session?.user.role !== "ADMIN") {
        return {
            authorized: false,
            response: NextResponse.json({ error: "não autorizado", status: 401 })
        }
    }
    return { authorized: true, user: session.user }
}