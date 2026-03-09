import prisma from "@/lib/prisma";

interface CreateContestInput {
    title: string;
    description: string;
    registrationStart: Date;
    registrationEnd: Date;
    examDate: Date;
}
type updateContestInput = Partial<CreateContestInput>

export const createContest = async (input: CreateContestInput) => {
    const create = await prisma.contest.create({
        data: {
            title: input.title,
            description: input.description,
            registrationStart: input.registrationStart,
            registrationEnd: input.registrationEnd,
            examDate: input.examDate,
        },
    });
    return create;
}

export const getAllContests = async () => {
    const getcont = prisma.contest.findMany();
    return getcont;
}

export const getContestById = async (id: string) => {
    const getcont = await prisma.contest.findUnique({
        where: {
            id,
        },
    });
    return getcont;
}

export const updateContest = async (id: string, input: updateContestInput) => {
    const updateCont = await prisma.contest.update({
        where: { id },
        data: input
    })
    return updateCont
}
export const deleteContest = async (id: string) => {
    const deletCon = await prisma.contest.delete({
        where: { id }
    })
    return deletCon
}
