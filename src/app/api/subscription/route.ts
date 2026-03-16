import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic'

import {
    createSubscription, updateSubscription, deleteSubscription, getSubscriptionById,
    getAllSubscription
} from "./service"
import { baseSchema } from "./subscriptionSchema"
import { auth } from "@/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        // Inject userId from session to pass validation
        body.userId = session.user.id

        const parsed = baseSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: parsed.error.format() },
                { status: 400 }
            )
        }
        const newSubscription = await createSubscription(parsed.data)
        return NextResponse.json(newSubscription)
    } catch (error) {
        console.error("Erro ao criar inscrição:", error)
        return NextResponse.json(
            { error: "Erro interno ao criar inscrição" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const subscriptions = await getAllSubscription(session.user.id)
        return NextResponse.json(subscriptions)
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error)
        return NextResponse.json(
            { error: "Erro interno ao buscar inscrições" },
            { status: 500 }
        )
    }
}