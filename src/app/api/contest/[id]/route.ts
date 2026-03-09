import { getContestById, deleteContest, updateContest } from "../service"
import { NextResponse } from "next/server"
import { updateContestSchema } from "../schemas"

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }) {
    try {
        const { params } = await context
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
    context: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json()
        const validatedData = updateContestSchema.parse(body)
        const { params } = await context
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
    context: { params: Promise<{ id: string }> }) {
    try {
        const { params } = context
        const { id } = await params
        const contest = await deleteContest(id)
        return NextResponse.json(contest)
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}


