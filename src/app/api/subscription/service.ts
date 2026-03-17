import prisma from "@/lib/prisma"
import { CreateSubscriptionInput, UpdateSubscriptionInput } from "./subscriptionSchema"
import { createNotification } from "@/lib/notification"

export const createSubscription = async (input: CreateSubscriptionInput) => {
    try {
        const newSubciption = await prisma.$transaction(async (tx) => {
            const verifySubscription = await tx.subscription.findUnique({
                where: {
                    userId_contestId: {
                        contestId: input.contestId,
                        userId: input.userId
                    }
                },
            })
            if (verifySubscription) throw new Error("Você já está inscrito neste concurso")

            const verifyContest = await tx.contest.findUnique({
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

            const user = await tx.user.findUnique({
                where: { id: input.userId },
                select: {
                    name: true,
                    phone: true,
                    cpf: true,
                    birthDate: true,
                    schooling: true,
                    street: true,
                    city: true,
                    state: true,
                    zipCode: true
                }
            })

            if (!user) throw new Error("Usuário não encontrado")

            const requiredFields = [
                { key: 'phone', label: 'Telefone' },
                { key: 'cpf', label: 'CPF' },
                { key: 'birthDate', label: 'Data de Nascimento' },
                { key: 'schooling', label: 'Escolaridade' },
                { key: 'street', label: 'Endereço/Rua' },
                { key: 'city', label: 'Cidade' },
                { key: 'state', label: 'Estado' },
                { key: 'zipCode', label: 'CEP' }
            ]

            const missingFields = requiredFields
                .filter(field => !user[field.key as keyof typeof user])
                .map(field => field.label)

            if (missingFields.length > 0) {
                throw new Error(`Complete seu perfil para se inscrever. Campos faltantes: ${missingFields.join(", ")}`)
            }

            const { documents, ...rest } = input

            const createdSubscription = await tx.subscription.create({
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
            return createdSubscription
        })
        try {
            await createNotification({
                userId: newSubciption.userId,
                title: "Inscrição Realizada",
                message: `Sua inscrição para o concurso "${newSubciption.contest.title}" foi realizada com sucesso!`,
                sendEmailNotification: true
            })

        } catch (error) {
            console.log("Erro ao enviar notificação:", error)
            throw error
        }
        return newSubciption
    } catch (err: any) {
        if (err.code === "P2002") {
            throw new Error("Você já está inscrito neste concurso")
        }

        throw err
    }
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

export const getSubscriptionByStatus = async (status: string) => {
    const getStatus = await prisma.subscription.findMany({
        where: { status: { in: ["APPROVED"] } },
    })
    return getStatus
}   