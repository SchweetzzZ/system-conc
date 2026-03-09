import { z } from "zod";

const baseSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  registrationStart: z.coerce.date({ message: "Data de início inválida" }),
  registrationEnd: z.coerce.date({ message: "Data de término inválida" }),
  examDate: z.coerce.date({ message: "Data da prova inválida" }),
});

export const contestSchema = baseSchema.refine((data) => data.registrationEnd > data.registrationStart, {
  message: "A data de término deve ser posterior à data de início",
  path: ["registrationEnd"],
});

export const updateContestSchema = baseSchema.partial();
