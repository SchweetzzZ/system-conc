import { NextResponse } from "next/server";
import { createNotice, listNotices } from "./service";
import { createNoticeSchema } from "./notice.schema";
import { adminGuard } from "@/lib/api-guard";

export async function POST(req: Request) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }

    try {
        const body = await req.json();
        const parsed = createNoticeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: parsed.error.format() },
                { status: 400 }
            );
        }

        const notice = await createNotice(parsed.data);
        return NextResponse.json(notice, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar notícia:", error);
        return NextResponse.json(
            { error: "Erro interno ao criar notícia" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const contestId = searchParams.get("contestId");

    if (!contestId) {
        return NextResponse.json(
            { error: "ID do concurso é obrigatório" },
            { status: 400 }
        );
    }

    try {
        const notices = await listNotices(contestId);
        return NextResponse.json(notices);
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        return NextResponse.json(
            { error: "Erro interno ao buscar notícias" },
            { status: 500 }
        );
    }
}

