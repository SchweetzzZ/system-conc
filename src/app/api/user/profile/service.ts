import prisma from "@/lib/prisma"

export async function getUserProfile(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            cpf: true,
            birthDate: true,
            schooling: true,
            street: true,
            city: true,
            state: true,
            zipCode: true,
            image: true
        }
    })
}

export async function updateUserProfile(userId: string, data: any) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            phone: data.phone,
            cpf: data.cpf,
            birthDate: data.birthDate, // Já chega como Date ou undefined do route.ts
            schooling: data.schooling,
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            image: data.image
        }
    })
}
