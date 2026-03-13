import { NextResponse } from "next/server"
import { getSubscriptionById, updateSubscription, deleteSubscription } from "../service"
import { updateSubscriptionSchema } from "../subscriptionSchema"
import { adminGuard } from "@/lib/api-guard"


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()
    if (!guard.authorized) {
        return guard.response
    }
    const { id } = await params
    try {
        const body = await req.json()
        const parsed = updateSubscriptionSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: parsed.error.format() },
                { status: 400 }
            )
        }
        const updatedSubscription = await updateSubscription(id, parsed.data)
        return NextResponse.json(updatedSubscription)
    } catch (error) {
        console.error("Erro ao atualizar inscrição:", error)
        return NextResponse.json(
            { error: "Erro interno ao atualizar inscrição" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()
    if (!guard.authorized) {
        return guard.response
    }
    const { id } = await params
    try {
        const deletedSubscription = await deleteSubscription(id)
        return NextResponse.json(deletedSubscription)
    } catch (error) {
        console.error("Erro ao deletar inscrição:", error)
        return NextResponse.json(
            { error: "Erro interno ao deletar inscrição" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const subscription = await getSubscriptionById(id)
        if (!subscription) {
            return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 })
        }
        return NextResponse.json(subscription)
    } catch (error) {
        console.error("Erro ao buscar inscrição:", error)
        return NextResponse.json(
            { error: "Erro interno ao buscar inscrição" },
            { status: 500 }
        )
    }
}