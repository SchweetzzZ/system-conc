import { NextResponse } from "next/server"
import { baseSchema } from "./subscriptionDocuments.schema"
import { createSubscriptionDocument, getSubscriptionDocuments } from "./service"
import { adminGuard } from "@/lib/api-guard"

export async function POST(req: Request) {
    try {
        const guard = await adminGuard()
        if (!guard.authorized) {
            return guard.response
        }
        const body = await req.json()
        const parsed = await baseSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.format() }, { status: 400 })
        }
        const createdDocument = await createSubscriptionDocument(parsed.data)
        return NextResponse.json(createdDocument)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
export async function GET(req: Request) {
    try {
        const getDocs = await getSubscriptionDocuments()
        return NextResponse.json(getDocs)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}