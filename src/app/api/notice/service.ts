import prisma from "@/lib/prisma";
import { CreateNoticeInput, UpdateNoticeInput } from "./notice.schema";
import { deleteFromS3 } from "@/lib/s3";

export class NoticeService {
  static async create(data: CreateNoticeInput) {
    return await prisma.notice.create({
      data,
    });
  }

  static async update(id: string, data: UpdateNoticeInput) {
    // Se estiver atualizando o arquivo, podemos querer deletar o antigo do S3
    if (data.fileKey) {
      const notice = await prisma.notice.findUnique({
        where: { id },
        select: { fileKey: true },
      });

      if (notice && notice.fileKey !== data.fileKey) {
        await deleteFromS3(notice.fileKey);
      }
    }

    return await prisma.notice.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    const notice = await prisma.notice.findUnique({
      where: { id },
      select: { fileKey: true },
    });

    if (notice) {
      await deleteFromS3(notice.fileKey);
    }

    return await prisma.notice.delete({
      where: { id },
    });
  }

  static async listByContest(contestId: string) {
    return await prisma.notice.findMany({
      where: { contestId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    return await prisma.notice.findUnique({
      where: { id },
    });
  }
}
