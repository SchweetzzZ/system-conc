import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic'

import { auth } from "@/auth"
import { getUserProfile, updateUserProfile } from "./service"
import { updateProfileSchema } from "./profileSchema"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    try {
        const profile = await getUserProfile(session.user.id)
        return NextResponse.json(profile)
    } catch (error) {
        return NextResponse.json({ error: "Erro ao carregar perfil" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    try {
        const body = await req.json()
        
        // 1. Normalizar CPF (extrair apenas números)
        if (body.cpf) body.cpf = body.cpf.replace(/\D/g, '')

        // 2. Normalizar CEP
        if (body.zipCode) body.zipCode = body.zipCode.replace(/\D/g, '')

        // 3. Validar Schema
        const parsed = updateProfileSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos", details: parsed.error.format() }, { status: 400 })
        }

        const dataToUpdate = parsed.data
        if (dataToUpdate.birthDate && typeof dataToUpdate.birthDate === 'string') {
            dataToUpdate.birthDate = new Date(dataToUpdate.birthDate)
        }

        const updated = await updateUserProfile(session.user.id, dataToUpdate)
        return NextResponse.json(updated)
    } catch (error: any) {
        console.error("ERRO NO PERFIL:", error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "CPF já cadastrado em outra conta." }, { status: 400 })
        }
        return NextResponse.json({ error: "Erro ao salvar dados básicos." }, { status: 500 })
    }
}
