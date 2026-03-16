import { NextResponse } from "next/server";
import { createContestPosition, getAllContestPosition } from "./service";
import { baseSchema } from "./schema"
import { adminGuard } from "@/lib/api-guard"

export async function POST(request: Request) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }
    try {
        const body = await request.json()
        const validatePost = baseSchema.parse(body)
        const create = await createContestPosition(validatePost)
        return NextResponse.json(create, { status: 201 })
    } catch (error: any) {
        console.log("erro no POST /api/contestposition:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const getAll = await getAllContestPosition()
        return NextResponse.json(getAll)
    } catch (error: any) {
        console.log("erro no GET: ", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}