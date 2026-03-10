import prisma from "@/lib/prisma"

interface CreateContestStageInput {
    constestId: string,
    name: string,
    order: number,
    description: string,
}
type UpdateContestStageInput = Partial<Omit<CreateContestStageInput, "constestId">>

export const createContestStage = async (input: CreateContestStageInput) => {
    const create = await prisma.contestStage.create({
        data: {
            contestId: input.constestId,
            name: input.name,
            order: input.order,
            description: input.description,
        }
    })
    return create
}

export const updateContestStage = async (id: string, input: UpdateContestStageInput) => {
    const update = await prisma.contestStage.update({
        where: { id },
        data: input
    })
    return update
}

export const deleteContestStage = async (id: string) => {
    const delet = await prisma.contestStage.delete({
        where: { id }
    })
    return delet
}

export const getContestStageById = async (id: string) => {
    const getById = await prisma.contestStage.findUnique({
        where: { id }
    })
    return getById
}

export const getAllContestStage = async () => {
    const getAll = await prisma.contestStage.findMany()
    return getAll
}