"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        // Chamada oficial do NextAuth para fazer login
        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/home", // para onde ir após logar
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-10">
            <input name="email" type="email" placeholder="Email" required className="border p-2 text-black" />
            <input name="password" type="password" placeholder="Senha" required className="border p-2 text-black" />
            <button type="submit" className="bg-blue-500 p-2 text-white">Entrar</button>
        </form>
    )
}
