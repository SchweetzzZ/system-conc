"use client"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const registered = searchParams.get("registered")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            await signIn("credentials", {
                email,
                password,
                callbackUrl: "/home",
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            {registered && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs font-bold">
                    ✅ Conta criada! Agora você pode fazer o login.
                </div>
            )}
            
            <div className="space-y-2">
                <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                    <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center transition-transform group-hover:-rotate-3">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="font-bold text-xl tracking-tighter">SISTEMA CONCURSOS</span>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
                <p className="text-slate-500 text-sm font-medium">Faça login para gerenciar suas inscrições e editais.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">E-mail</label>
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="exemplo@email.com" 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-300 text-sm font-medium" 
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Senha</label>
                        <button type="button" className="text-[10px] font-bold text-slate-400 hover:text-slate-900">Esqueceu?</button>
                    </div>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-300 text-sm font-medium" 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Acessar Conta'}
                </button>
            </form>

            <p className="text-center text-slate-500 text-sm font-medium pt-4">
                Não tem conta? <Link href="/register" className="text-slate-900 font-bold hover:underline">Solicite acesso</Link>
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans text-slate-900">
            {/* Left Side: Form */}
            <div className="flex flex-col items-center justify-center p-8 md:p-16">
                <Suspense fallback={<div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}>
                    <LoginForm />
                </Suspense>
            </div>

            {/* Right Side: Visual */}
            <div className="hidden lg:block relative p-12 bg-slate-50 overflow-hidden">
                <div className="h-full w-full bg-blue-600 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 blur-3xl rounded-full opacity-50"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-center p-20 text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-12 w-fit">
                            Segurança & Confiabilidade
                        </div>
                        <h2 className="text-7xl font-black leading-[0.9] tracking-tighter mb-8 transform transition-transform group-hover:scale-105 duration-700">
                            Acompanhe seu <br />
                            sucesso passo <br />
                            a passo.
                        </h2>
                        <p className="text-xl text-blue-100 font-medium max-w-md leading-relaxed">
                            A plataforma oficial para candidatos. Acesse editais, verifique convocações e gerencie seus documentos de forma 100% digital.
                        </p>
                    </div>

                    <div className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 glass animate-bounce-slow">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-400 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white opacity-60">Status Atual</div>
                                <div className="text-lg font-black text-white">Inscrição Confirmada</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
