import { NextResponse } from "next/server"
import { createSubscriptionStageResult, getSubscriptionStageResults } from "./service"
import { baseSchema } from "./subStageResult.schema"
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
        const createdResult = await createSubscriptionStageResult(parsed.data)
        return NextResponse.json(createdResult)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
export async function GET(req: Request) {
    try {
        const getResults = await getSubscriptionStageResults()
        return NextResponse.json(getResults)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}