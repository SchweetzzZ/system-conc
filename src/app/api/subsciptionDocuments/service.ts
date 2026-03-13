import prisma from "@/lib/prisma"
import { CreateSubscriptionDocumentInput, UpdateSubscriptionDocumentInput } from "./subscriptionDocuments.schema"

export async function createSubscriptionDocument(data: CreateSubscriptionDocumentInput) {
    const verify = await prisma.subscription.findUnique({ where: { id: data.subscriptionId } })
    if (!verify) {
        throw new Error("Inscrição não encontrada")
    }
    const lastDoc = await prisma.subscriptionDocument.findFirst({
        where: {
            subscriptionId: data.subscriptionId,
            type: data.type
        },
        orderBy: { createdAt: "desc" }
    })
    if (lastDoc && lastDoc?.status === "PENDING") {
        throw new Error("Documento já pendente")
    }
    if (lastDoc && lastDoc?.status === "APPROVED") {
        throw new Error("Documento já foi aprovado, não é possível enviar novamente")
    }
    const createDoc = await prisma.subscriptionDocument.create({ data })
    return createDoc
}

export async function updateSubscriptionDocument(id: string, data: UpdateSubscriptionDocumentInput) {
    const document = await prisma.subscriptionDocument.findUnique({ where: { id } })
    if (!document) {
        throw new Error("Documento não encontrado")
    }
    if (document.status === "APPROVED") {
        throw new Error("Documento já aprovado não pode ser alterado")
    }
    const updateDoc = await prisma.subscriptionDocument.update({
        where: { id },
        data: {
            status: data.status
        }
    })
    return updateDoc
}

export async function deleteSubscriptionDocument(id: string) {
    const deleteDoc = await prisma.subscriptionDocument.delete({ where: { id } })
    return deleteDoc
}

export async function getSubscriptionDocumentById(id: string) {
    const getDoc = await prisma.subscriptionDocument.findUnique({ where: { id } })
    return getDoc
}

export async function getSubscriptionDocuments() {
    const getDocs = await prisma.subscriptionDocument.findMany()
    return getDocs
}