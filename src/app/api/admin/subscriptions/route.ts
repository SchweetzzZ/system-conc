import { NextResponse } from "next/server"
import { adminGuard } from "@/lib/api-guard"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notification"

// Força o Next.js a não fazer cache desta rota (sempre buscar do banco)
export const dynamic = 'force-dynamic'

export async function GET() {
    const guard = await adminGuard()
    if (!guard.authorized) return guard.response

    try {
        const subscriptions = await prisma.subscription.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        schooling: true,
                        birthDate: true,
                        street: true,
                        city: true,
                        state: true,
                        zipCode: true
                    }
                },
                contest: true,
                position: true,
                documents: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(subscriptions)
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar inscrições" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    const guard = await adminGuard()
    if (!guard.authorized) return guard.response

    try {
        const { id, status } = await req.json()

        // 1. Atualizar a inscrição e TODOS os documentos vinculados a ela
        const updated = await prisma.subscription.update({
            where: { id },
            data: { 
                status: status,
                documents: {
                    updateMany: {
                        where: { subscriptionId: id },
                        data: { status: status as any } // APPROVED ou REJECTED
                    }
                }
            },
            include: { 
                contest: true,
                user: true,
                position: true
            }
        })

        // 2. Notificar o candidato sobre a decisão
        const title = status === "APPROVED" ? "Inscrição Homologada! ✅" : "Inscrição Indeferida! ❌"
        const message = status === "APPROVED" 
            ? `Sua inscrição para o cargo "${updated.position.name}" no concurso "${updated.contest.title}" foi aprovada!`
            : `Sua inscrição para o cargo "${updated.position.name}" no concurso "${updated.contest.title}" foi indeferida após análise documental.`

        await createNotification({
            userId: updated.userId,
            title,
            message,
            sendEmailNotification: true
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Erro no PATCH Admin:", error)
        return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 })
    }
}
