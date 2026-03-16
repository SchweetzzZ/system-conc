import prisma from "@/lib/prisma"
import { CreateSubscriptionInput, UpdateSubscriptionInput } from "./subscriptionSchema"
import { createNotification } from "@/lib/notification"

export const createSubscription = async (input: CreateSubscriptionInput) => {
    const verifyContest = await prisma.contest.findUnique({
        where: { id: input.contestId },
        select: {
            registrationStart: true,
            registrationEnd: true
        }
    })
    if (!verifyContest) throw new Error("Concurso não encontrado")

    const now = new Date()
    if (now > verifyContest.registrationEnd) throw new Error("Inscrições encerradas")
    if (now < verifyContest.registrationStart) throw new Error("Inscrições não abertas")

    const { documents, ...rest } = input

    const newSubciption = await prisma.subscription.create({
        data: {
            ...rest,
            documents: {
                create: documents?.map(doc => ({
                    userId: input.userId,
                    type: doc.type,
                    fileUrl: doc.fileUrl,
                    fileKey: doc.fileKey,
                }))
            }
        },
        include: {
            contest: true
        }
    })

    // Notify user about subscription
    await createNotification({
        userId: newSubciption.userId,
        title: "Inscrição Realizada",
        message: `Sua inscrição para o concurso "${newSubciption.contest.title}" foi realizada com sucesso!`,
        sendEmailNotification: true
    })

    return newSubciption
}

export const updateSubscription = async (id: string, input: UpdateSubscriptionInput) => {
    const update = await prisma.subscription.update({
        where: { id },
        data: input
    })
    return update
}

export const deleteSubscription = async (id: string) => {
    const del = await prisma.subscription.delete({
        where: { id }
    })
    return del
}

export const getSubscriptionById = async (id: string) => {
    const get = await prisma.subscription.findUnique({
        where: { id }
    })
    return get
}

export const getAllSubscription = async (userId?: string) => {
    const getAll = await prisma.subscription.findMany({
        where: userId ? { userId } : {},
        include: {
            contest: {
                include: {
                    stages: { orderBy: { order: 'asc' } },
                    notices: { orderBy: { createdAt: 'desc' } },
                    news: { orderBy: { createdAt: 'desc' } }
                }
            },
            position: true,
            results: {
                include: { stage: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return getAll
}