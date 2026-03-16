import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { registerSchema } from "./register.schema"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, cpf } = registerSchema.parse(body)
        const cpfClean = cpf.replace(/\D/g, '')

        const [existEmail, existCpf] = await Promise.all([
            prisma.user.findUnique({ where: { email } }),
            prisma.user.findUnique({ where: { cpf: cpfClean } })
        ])

        if (existEmail) {
            return NextResponse.json({ message: "E-mail já cadastrado" }, { status: 400 })
        }
        if (existCpf) {
            return NextResponse.json({ message: "CPF já cadastrado" }, { status: 400 })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                cpf: cpfClean,
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