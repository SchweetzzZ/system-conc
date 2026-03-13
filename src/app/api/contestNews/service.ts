import prisma from "@/lib/prisma"
import { CreateContestNewsInput, UpdateContestNewsInput } from "./contestNewsSchema"

export async function createContestNews(data: CreateContestNewsInput) {
    return await prisma.contestNews.create({
        data
    })
}

export async function updateContestNews(id: string, data: UpdateContestNewsInput) {
    return await prisma.contestNews.update({
        where: { id },
        data
    })
}

export async function deleteContestNews(id: string) {
    return await prisma.contestNews.delete({
        where: { id }
    })
}

export async function getContestNews(id: string) {
    return await prisma.contestNews.findUnique({
        where: { id }
    })
}

export async function listContestNews(contestId: string) {
    return await prisma.contestNews.findMany({
        where: { contestId },
        orderBy: { createdAt: "desc" }
    })
}