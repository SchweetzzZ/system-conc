import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

interface CreateContestPositionInput {
    contestId: string
    name: string
    vacancies: number
    salary: number
}

type UpdateConstestPosition = Partial<
    Omit<CreateContestPositionInput, "contestId">>
export const toDecimal = (value: number) => new Prisma.Decimal(value)


export const createContestPosition = async (input: CreateContestPositionInput) => {
    const create = await prisma.contestPosition.create({
        data: {
            contestId: input.contestId,
            name: input.name,
            vacancies: input.vacancies,
            salary: input.salary
        }
    })
    return create
}

export const updateConstestPosition = async (id: string, input: UpdateConstestPosition) => {
    const update = await prisma.contestPosition.update({
        where: { id },
        data: input
    })
    return update
}

export const deleteContestPosition = async (id: string) => {
    const delet = await prisma.contestPosition.delete({
        where: { id }
    })
    return delet
}

export const getAllContestPosition = async () => {
    const getAll = await prisma.contestPosition.findMany()
    return getAll
}
export const getContestPositionById = async (id: string) => {
    const getById = await prisma.contestPosition.findUnique({
        where: { id }
    })
    return getById
}