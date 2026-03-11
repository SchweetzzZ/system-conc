import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  contestId: z.string().uuid("ID de concurso inválido"),
  fileUrl: z.string().url("URL de arquivo inválida"),
  fileKey: z.string().min(1, "A chave do arquivo é obrigatória"),
});

export const updateNoticeSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres").optional(),
  fileUrl: z.string().url("URL de arquivo inválida").optional(),
  fileKey: z.string().min(1, "A chave do arquivo é obrigatória").optional(),
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
