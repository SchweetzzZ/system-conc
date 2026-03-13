import prisma from "@/lib/prisma"
import { CreateSubscriptionInput, UpdateSubscriptionInput } from "./subscriptionSchema"

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

    const newSubciption = await prisma.subscription.create({
        data: input
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

export const getAllSubscription = async () => {
    const getAll = await prisma.subscription.findMany()
    return getAll
}