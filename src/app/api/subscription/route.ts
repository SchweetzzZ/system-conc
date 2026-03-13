import { NextResponse } from "next/server"
import {
    createSubscription, updateSubscription, deleteSubscription, getSubscriptionById,
    getAllSubscription
} from "./service"
import { baseSchema } from "./subscriptionSchema"
import { adminGuard } from "@/lib/api-guard"

export async function POST(req: Request) {
    try {
        const guard = await adminGuard()
        if (!guard.authorized) {
            return guard.response
        }

        const body = await req.json()
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
        const subscriptions = await getAllSubscription()
        return NextResponse.json(subscriptions)
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error)
        return NextResponse.json(
            { error: "Erro interno ao buscar inscrições" },
            { status: 500 }
        )
    }
}