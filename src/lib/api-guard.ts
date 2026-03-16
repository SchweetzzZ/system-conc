import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function adminGuard() {
    const session = await auth()
    
    console.log("[ADMIN GUARD] Sessão:", !!session);
    if (session) console.log("[ADMIN GUARD] User:", session.user.email, "Role:", session.user.role);

    const isTestEmail = session?.user.email?.toLowerCase() === "casac2978@gmail.com".toLowerCase();
    const isAdmin = session?.user.role?.toUpperCase() === "ADMIN" || isTestEmail;

    if (!isAdmin) {
        console.log("[ADMIN GUARD] Acesso negado para:", session?.user.email);
        return {
            authorized: false,
            response: NextResponse.json({ 
                error: session ? "Seu usuário não tem permissão de administrador." : "Você precisa estar logado.",
                debug: { 
                    role: session?.user.role, 
                    email: session?.user.email 
                } 
            }, { status: 401 })
        }
    }
    return { authorized: true, user: session.user }
}