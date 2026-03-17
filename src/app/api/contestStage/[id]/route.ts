import { NextResponse } from "next/server"
import { getContestStageById, updateContestStage, deleteContestStage } from "../service"
import { updateSchema } from "../contestStage.Schema"
import { adminGuard } from "@/lib/api-guard"

export async function DELETE(request: Request,
    context: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }
    try {
        const { params } = await context
        const { id } = await params
        const up = await deleteContestStage(id)
        return NextResponse.json(up, { status: 201 })

    } catch (error: any) {
        console.log("error no deleteContestStage:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(request: Request,
    context: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }
    try {
        const body = await request.json()
        const validate = updateSchema.parse(body)
        const { params } = await context
        const { id } = await params
        const up = await updateContestStage(id, validate)
        return NextResponse.json(up, { status: 201 })
    } catch (error: any) {
        console.log("error no updateContestStage:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(request: Request,
    context: { params: Promise<{ id: string }> }) {
    try {
        const { params } = await context
        const { id } = await params
        const gett = await getContestStageById(id)
        return NextResponse.json(gett)
    } catch (error: any) {
        console.log("error no getContestStageById:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}