import { NextResponse } from "next/server"
import { CreateSubscriptionDocumentInput } from "./subscriptionDocuments.schema"
import { createSubscriptionDocument, getSubscriptionDocuments } from "./service"
import { adminGuard } from "@/lib/api-guard"

export async function POST(req: Request) {
    try {
        const guard = await adminGuard()
        if (!guard.authorized) {
            return guard.response
        }
        const body = await req.json() as CreateSubscriptionDocumentInput
        const createdDocument = await createSubscriptionDocument(body)
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