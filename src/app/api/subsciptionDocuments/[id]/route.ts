import { NextResponse } from "next/server"
import { updateSubscriptionDocument, getSubscriptionDocumentById, deleteSubscriptionDocument } from "../service"
import { updateSubscriptionDocumentSchema } from "../subscriptionDocuments.schema"
import { adminGuard } from "@/lib/api-guard"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()
    if (!guard.authorized) {
        return guard.response
    }
    const { id } = await params
    try {
        const body = await req.json()
        const parsed = updateSubscriptionDocumentSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: parsed.error.format() },
                { status: 400 }
            )
        }
        const updatedDocument = await updateSubscriptionDocument(id, parsed.data)
        return NextResponse.json(updatedDocument)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const document = await getSubscriptionDocumentById(id)
        if (!document) {
            return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 })
        }
        return NextResponse.json(document)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()
    if (!guard.authorized) {
        return guard.response
    }
    const { id } = await params
    try {
        const deletedDocument = await deleteSubscriptionDocument(id)
        return NextResponse.json(deletedDocument)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}