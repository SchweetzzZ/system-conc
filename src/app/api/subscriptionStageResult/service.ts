import prisma from "@/lib/prisma"
import { CreateSubscriptionStageResultInput, UpdateSubscriptionStageResultInput } from "./subStageResult.schema"

export async function createSubscriptionStageResult(data: CreateSubscriptionStageResultInput) {
    const verify = await prisma.subscription.findUnique({ where: { id: data.subscriptionId } })
    if (!verify) {
        throw new Error("Inscrição não encontrada")
    }
    const verifyStage = await prisma.contestStage.findUnique({ where: { id: data.stageId } })
    if (!verifyStage) {
        throw new Error("Fase não encontrada")
    }
    const createResult = await prisma.subscriptionStageResult.create({ data })
    return createResult
}

export async function updateSubscriptionStageResult(id: string, data: UpdateSubscriptionStageResultInput) {
    const updateResult = await prisma.subscriptionStageResult.update({
        where: { id },
        data: {
            score: data.score,
            result: data.result
        }
    })
    return updateResult
}

export async function deleteSubscriptionStageResult(id: string) {

    const deleteResult = await prisma.subscriptionStageResult.delete({ where: { id } })
    return deleteResult
}

export async function getSubscriptionStageResultById(id: string) {
    const getResult = await prisma.subscriptionStageResult.findUnique({ where: { id } })
    return getResult
}

export async function getSubscriptionStageResults() {
    const getResults = await prisma.subscriptionStageResult.findMany()
    return getResults
}