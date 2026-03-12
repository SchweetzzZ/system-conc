import { NextResponse } from "next/server";
import { createContest, getAllContests } from "./service";
import { contestSchema } from "./schemas";
import { adminGuard } from "@/lib/api-guard";

export async function POST(request: Request) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }
    try {
        const body = await request.json();
        const validatedData = contestSchema.parse(body);
        const create = await createContest(validatedData);
        return NextResponse.json(create, { status: 201 });
    } catch (error: any) {
        console.error("Erro no POST /api/contest:", error); // Adicionado para debug
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    const get = await getAllContests();
    return NextResponse.json(get);
}
