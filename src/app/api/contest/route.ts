import { NextResponse } from "next/server";
import { createContest, getAllContests } from "./service";
import { contestSchema } from "./schemas";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("depois do body");
        const validatedData = contestSchema.parse(body);
        console.log("depois do validatedData");
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
