import prisma from "@/lib/prisma"
import { CreateNoticeInput, UpdateNoticeInput } from "./notice.schema"
import { deleteFromS3 } from "@/lib/s3"

export const createNotice = async (input: CreateNoticeInput) => {
    const createdNotice = await prisma.notice.create({
        data: input
    })
    return createdNotice
}

export const updateNotice = async (id: string, input: UpdateNoticeInput) => {
    if (input.fileKey) {
        const existingNotice = await prisma.notice.findUnique({
            where: { id },
            select: { fileKey: true }
        })
        if (existingNotice && existingNotice.fileKey !== input.fileKey) {
            await deleteFromS3(existingNotice.fileKey)
        }
    }
    const updatedNotice = await prisma.notice.update({
        where: { id },
        data: input
    })
    return updatedNotice
}

export const deleteNotice = async (id: string) => {
    const notice = await prisma.notice.findUnique({
        where: { id },
        select: { fileKey: true }
    })
    if (notice) {
        await deleteFromS3(notice.fileKey)
    }
    const deletedNotice = await prisma.notice.delete({
        where: { id }
    })
    return deletedNotice
}

export const listNotices = async (contestId: string) => {
    const listedNotices = await prisma.notice.findMany({
        where: { contestId },
        orderBy: { createdAt: "desc" }
    })
    return listedNotices
}

export const getNoticeById = async (id: string) => {
    const getNotice = await prisma.notice.findUnique({
        where: { id }
    })
    return getNotice
}