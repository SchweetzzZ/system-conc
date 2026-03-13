import { NextResponse } from "next/server";
import { createContestNews } from "./service";
import { createContestNewsSchema } from "./contestNewsSchema";
import { adminGuard } from "@/lib/api-guard";

export async function POST(req: Request) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }

    try {
        const body = await req.json();
        const parsed = createContestNewsSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: parsed.error.format() },
                { status: 400 }
            );
        }

        const contestNews = await createContestNews(parsed.data);
        return NextResponse.json(contestNews, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar notícia:", error);
        return NextResponse.json(
            { error: "Erro interno ao criar notícia" },
            { status: 500 }
        );
    }
}