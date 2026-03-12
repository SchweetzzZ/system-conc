import { getContestById, deleteContest, updateContest } from "../service"
import { NextResponse } from "next/server"
import { updateContestSchema } from "../schemas"
import { adminGuard } from "@/lib/api-guard"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const contest = await getContestById(id)
        if (!contest) return NextResponse.json({ message: "Contest not found" }, { status: 404 })
        return NextResponse.json(contest)
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }
    try {
        const body = await request.json()
        const validatedData = updateContestSchema.parse(body)
        const { id } = await params
        const contest = await updateContest(id, validatedData)
        return NextResponse.json(contest)
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const guard = await adminGuard()

    if (!guard.authorized) {
        return guard.response
    }
    try {
        const { id } = await params
        const contest = await deleteContest(id)
        return NextResponse.json(contest)
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}


