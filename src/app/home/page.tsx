import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
            <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Contest System</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-sm">
                            <p className="text-zinc-500 dark:text-zinc-400">Bem-vindo,</p>
                            <p className="font-medium">{session.user?.name}</p>
                        </div>

                        <form action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/login" })
                        }}>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Sair
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid gap-8">
                    <header className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">Área do Candidato</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                            Gerencie suas inscrições e acompanhe os resultados dos concursos.
                        </p>
                    </header>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2">Inscrições</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Veja o status das suas participações.</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                                0
                            </span>
                        </div>

                        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2">Editais</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Confira novas oportunidades abertas.</p>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                                Ver todos &rarr;
                            </button>
                        </div>

                        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2">Perfil</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Mantenha seus dados atualizados.</p>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                                Editar perfil &rarr;
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 p-12 rounded-3xl bg-zinc-900 dark:bg-zinc-800 text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Nenhum concurso ativo.</h2>
                            <p className="text-zinc-400 max-w-md">Fique atento às notificações para não perder novos editais de concursos públicos.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-20 -mt-20 rounded-full"></div>
                    </div>
                </div>
            </main>
        </div>
    )
}
