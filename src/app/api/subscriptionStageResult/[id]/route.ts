import { updateSubscriptionStageResult, deleteSubscriptionStageResult, getSubscriptionStageResultById } from "../service"
import { NextRequest, NextResponse } from "next/server"
import { baseSchema } from "../subStageResult.schema"
import { adminGuard } from "@/lib/api-guard"


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
        const updateResult = await updateSubscriptionStageResult(params.id, parsed.data)
        return NextResponse.json(updateResult)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const guard = await adminGuard()
        if (!guard.authorized) {
            return guard.response
        }
        const deleteResult = await deleteSubscriptionStageResult(params.id)
        return NextResponse.json(deleteResult)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const guard = await adminGuard()
        if (!guard.authorized) {
            return guard.response
        }
        const getResult = await getSubscriptionStageResultById(params.id)
        return NextResponse.json(getResult)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}