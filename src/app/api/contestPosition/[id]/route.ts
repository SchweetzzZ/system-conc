import { NextResponse } from "next/server";
import { updateConstestPosition, deleteContestPosition, getContestPositionById } from "../service";
import { updateSchema } from "../schema";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = request.json()
        const validateUpdate = updateSchema.parse(body)
        const { id } = await params
        const create = await updateConstestPosition(id, validateUpdate)
        return NextResponse.json(create, { status: 201 })
    } catch (error: any) {
        console.log("erro no update:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const delet = await deleteContestPosition(id)
        return NextResponse.json(delet, { status: 201 })
    } catch (error: any) {
        console.log("erro no delete:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const gett = await getContestPositionById(id)
        return NextResponse.json(gett, { status: 201 })
    } catch (error: any) {
        console.log("erro no delete:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
