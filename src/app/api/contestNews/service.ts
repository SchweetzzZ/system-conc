import prisma from "@/lib/prisma"
import { CreateContestNewsInput, UpdateContestNewsInput } from "./contestNewsSchema"
import { createNotification } from "@/lib/notification"

export async function createContestNews(data: CreateContestNewsInput) {
    const news = await prisma.contestNews.create({
        data,
        include: {
            contest: {
                select: {
                    title: true,
                    subscriptions: {
                        select: {
                            userId: true
                        }
                    }
                }
            }
        }
    })

    // Enviar notificações para todos os inscritos
    const subscriptions = news.contest.subscriptions;
    const contestTitle = news.contest.title;

    if (subscriptions.length > 0) {
        // Criar notificações em paralelo (limitado ou via fila seria ideal, mas aqui faremos direto para simplicidade)
        await Promise.all(
            subscriptions.map((sub: { userId: string }) => 
                createNotification({
                    userId: sub.userId,
                    title: `Nova Notícia: ${news.title}`,
                    message: `Uma nova atualização foi publicada para o concurso "${contestTitle}": ${news.title}`,
                    sendEmailNotification: true
                })
            )
        )
    }

    return news
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