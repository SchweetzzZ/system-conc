import { NextResponse } from "next/server"
import { createContestStage, getAllContestStage } from "./service"
import { baseSchema } from "./contestStage.Schema"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatePost = baseSchema.parse(body)
        const create = await createContestStage(validatePost)
        return NextResponse.json(create, { status: 201 })
    } catch (error: any) {
        console.log("erro no POST /api/conteststage:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const get = await getAllContestStage()
        return NextResponse.json(get)
    } catch (error: any) {
        console.log("error no GET /api/conteststage:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}