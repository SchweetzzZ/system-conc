import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { registerSchema } from "./register.schema"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password } = registerSchema.parse(body)

        const existUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existUser) {
            return NextResponse.json({ message: "Usuário já existe" }, { status: 400 })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                role: "USER"
            }
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error: any) {
        console.log("erro no register:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ errors: error.errors }, { status: 400 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}