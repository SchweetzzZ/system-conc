import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { NoticeService } from "./service";
import { createNoticeSchema } from "./notice.schema";

export async function POST(req: Request) {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
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

        const notice = await NoticeService.create(parsed.data);
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
        const notices = await NoticeService.listByContest(contestId);
        return NextResponse.json(notices);
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        return NextResponse.json(
            { error: "Erro interno ao buscar notícias" },
            { status: 500 }
        );
    }
}

