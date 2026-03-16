"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name")
        const cpf = formData.get("cpf")
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, cpf, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Erro ao criar conta")
            }

            // Success - Redirect to login
            router.push("/login?registered=true")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans text-slate-900">
            {/* Left Side: Visual */}
            <div className="hidden lg:block relative p-12 bg-slate-50 overflow-hidden order-last lg:order-first">
                <div className="h-full w-full bg-indigo-600 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 blur-3xl rounded-full"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-center p-20 text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-12 w-fit">
                            Junte-se a nós
                        </div>
                        <h2 className="text-7xl font-black leading-[0.9] tracking-tighter mb-8 transform transition-transform group-hover:scale-105 duration-700">
                            Crie sua <br />
                            conta em <br />
                            segundos.
                        </h2>
                        <p className="text-xl text-indigo-100 font-medium max-w-md leading-relaxed">
                            Tenha acesso exclusivo aos editais mais recentes, envie documentos digitalmente e receba convocações em tempo real.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-col items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center transition-transform group-hover:-rotate-3">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="font-bold text-xl tracking-tighter">SISTEMA CONCURSOS</span>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Crie sua conta</h1>
                        <p className="text-slate-500 text-sm font-medium">Inicie sua jornada rumo à aprovação hoje mesmo.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Nome Completo</label>
                            <input 
                                name="name" 
                                type="text" 
                                placeholder="Seu nome aqui" 
                                required 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-300 text-sm font-medium text-slate-900" 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">CPF (apenas números)</label>
                            <input 
                                name="cpf" 
                                type="text" 
                                placeholder="000.000.000-00" 
                                required 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-300 text-sm font-medium text-slate-900" 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">E-mail</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="seu@email.com" 
                                required 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-300 text-sm font-medium text-slate-900" 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Senha</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                minLength={6}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-300 text-sm font-medium text-slate-900" 
                            />
                        </div>

                        <div className="flex items-start gap-3 px-1 pt-2">
                            <input type="checkbox" required className="mt-1 w-3 h-3 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                Li e concordo com os <button type="button" className="text-slate-900 font-bold hover:underline">Termos</button> e a <button type="button" className="text-slate-900 font-bold hover:underline">Privacidade</button>.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Criar minha conta'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 font-medium pt-4">
                        Já possui uma conta? <Link href="/login" className="text-blue-600 font-bold hover:underline">Fazer login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
