import { NextRequest, NextResponse } from "next/server";
import { createContestNews, listContestNews } from "../service";
import { createContestNewsSchema } from "../contestNewsSchema";
import { adminGuard } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }

    try {
        const body = await req.json()
        const parsed = createContestNewsSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: parsed.error.format() },
                { status: 400 }
            )
        }

        const contestNews = await createContestNews(parsed.data)
        return NextResponse.json(contestNews, { status: 201 })
    } catch (error) {
        console.error("Erro ao criar notícia:", error)
        return NextResponse.json(
            { error: "Erro interno ao criar notícia" },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const contestId = searchParams.get("contestId")

    if (!contestId) {
        return NextResponse.json(
            { error: "ID do concurso é obrigatório" },
            { status: 400 }
        )
    }

    try {
        const contestNews = await listContestNews(contestId)
        return NextResponse.json(contestNews)
    } catch (error) {
        console.error("Erro ao buscar notícias:", error)
        return NextResponse.json(
            { error: "Erro interno ao buscar notícias" },
            { status: 500 }
        )
    }
}