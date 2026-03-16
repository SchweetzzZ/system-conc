"use client"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("contests")
    const [contests, setContests] = useState<any[]>([])
    const [adminSubscriptions, setAdminSubscriptions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSub, setSelectedSub] = useState<any>(null)

    // Selection for sub-tabs
    const [selectedContestId, setSelectedContestId] = useState("")
    const [subTabStatus, setSubTabStatus] = useState("PENDING")

    // Form states
    const [contestForm, setContestForm] = useState({ title: "", description: "", registrationStart: "", registrationEnd: "", examDate: "" })
    const [positionForm, setPositionForm] = useState({ contestId: "", name: "", vacancies: 0, salary: 0, schooling: "" })
    const [stageForm, setStageForm] = useState({ contestId: "", name: "", order: 1, description: "" })
    const [newsForm, setNewsForm] = useState({ contestId: "", title: "", content: "" })
    const [noticeForm, setNoticeForm] = useState({ contestId: "", title: "", file: null as File | null })
    const [resultForm, setResultForm] = useState({ subscriptionId: "", stageId: "", score: 0, result: "PENDING" })

    const fetchData = async () => {
        try {
            const [cRes, sRes] = await Promise.all([
                fetch("/api/contest"),
                fetch("/api/admin/subscriptions")
            ])
            if (cRes.ok) setContests(await cRes.json())
            if (sRes.ok) setAdminSubscriptions(await sRes.json())
        } catch (err) { console.error(err) }
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (session) {
            const isAdmin = (session.user as any).role === "ADMIN" || session.user.email?.toLowerCase() === "casac2978@gmail.com".toLowerCase();
            if (!isAdmin) {
                router.push("/home")
            } else {
                fetchData()
            }
        }
    }, [status, session, router])

    const handleAction = async (url: string, method: string, body: any, successMsg: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            if (res.ok) {
                alert(`✅ ${successMsg}`)
                fetchData()
                return true
            } else {
                const data = await res.json()
                alert(`❌ Erro: ${data.error || "Falha na operação"}`)
            }
        } catch (err) { alert("⚠️ Erro de conexão") }
        finally { setIsLoading(false) }
        return false
    }

    const onCreateContest = (e: React.FormEvent) => {
        e.preventDefault()
        handleAction("/api/contest", "POST", {
            ...contestForm,
            registrationStart: new Date(contestForm.registrationStart).toISOString(),
            registrationEnd: new Date(contestForm.registrationEnd).toISOString(),
            examDate: new Date(contestForm.examDate).toISOString(),
        }, "Concurso criado!")
    }

    const onCreateStage = (e: React.FormEvent) => {
        e.preventDefault()
        handleAction("/api/contestStage", "POST", {
            constestId: stageForm.contestId,
            name: stageForm.name,
            order: Number(stageForm.order),
            description: stageForm.description
        }, "Etapa criada!")
    }

    const onCreateNews = (e: React.FormEvent) => {
        e.preventDefault()
        handleAction("/api/contestNews", "POST", newsForm, "Notícia publicada!")
    }

    const onFileUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!noticeForm.file) return
        setIsLoading(true)
        try {
            const preRes = await fetch("/api/upload/presigned", {
                method: "POST",
                body: JSON.stringify({ fileName: noticeForm.file.name, contentType: noticeForm.file.type, fileSize: noticeForm.file.size })
            })
            const { data } = await preRes.json()
            await fetch(data.uploadUrl, { method: "PUT", body: noticeForm.file, headers: { "Content-Type": noticeForm.file.type } })
            
            await handleAction("/api/notice", "POST", {
                contestId: noticeForm.contestId,
                title: noticeForm.title,
                fileUrl: data.fileUrl,
                fileKey: data.fileKey
            }, "Edital/Aviso enviado!")
        } catch (err) { alert("Erro no upload") }
        finally { setIsLoading(false) }
    }

    const onCreateResult = (e: React.FormEvent) => {
        e.preventDefault()
        handleAction("/api/subscriptionStageResult", "POST", {
            ...resultForm,
            score: Number(resultForm.score)
        }, "Resultado lançado!")
    }

    const handleUpdateSubStatus = async (id: string, status: string) => {
        await handleAction("/api/admin/subscriptions", "PATCH", { id, status }, "Status atualizado!")
        setSelectedSub(null)
    }

    const isAdmin = session?.user && ((session.user as any).role === "ADMIN" || session.user.email?.toLowerCase() === "casac2978@gmail.com".toLowerCase());

    if (status === "loading" || (session && !isAdmin)) {
        return <div className="p-20 text-center font-bold text-slate-400">Verificando permissões...</div>
    }

    const tabs = [
        { id: "contests", label: "Concursos", icon: "🏆" },
        { id: "positions", label: "Cargos", icon: "💼" },
        { id: "stages", label: "Etapas", icon: "📅" },
        { id: "homologate", label: "Homologar", icon: "⚖️" },
        { id: "results", label: "Notas/Resultados", icon: "📝" },
        { id: "notices", label: "Avisos/PDFs", icon: "📎" },
        { id: "news", label: "Notícias", icon: "📰" },
    ]

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Sidebar - Minimalist */}
                <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-10 px-2">
                        <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-[10px] text-white">A</div>
                        <span className="text-sm font-bold tracking-tight uppercase">Gestão</span>
                    </div>

                    <nav className="space-y-1 flex-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                    activeTab === tab.id ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
                        <Link href="/home" className="block w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 text-center">← Ir para o Portal</Link>
                        <button onClick={() => signOut()} className="w-full py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg">Deslogar</button>
                    </div>
                </aside>

                {/* Main Content - Minimalist */}
                <main className="flex-1 p-8 md:p-12 lg:p-16 max-w-5xl">
                    <h1 className="text-3xl font-bold mb-10 tracking-tight">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h1>

                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        {activeTab === "contests" && (
                            <form onSubmit={onCreateContest} className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Título do Edital</label>
                                    <input value={contestForm.title} onChange={e => setContestForm({...contestForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 outline-none text-sm font-medium" required />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Descrição Curta</label>
                                    <textarea value={contestForm.description} onChange={e => setContestForm({...contestForm, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 outline-none text-sm font-medium h-24" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Início Inscrições</label>
                                    <input type="date" value={contestForm.registrationStart} onChange={e => setContestForm({...contestForm, registrationStart: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Fim Inscrições</label>
                                    <input type="date" value={contestForm.registrationEnd} onChange={e => setContestForm({...contestForm, registrationEnd: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Data Prevista da Prova</label>
                                    <input type="date" value={contestForm.examDate} onChange={e => setContestForm({...contestForm, examDate: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                </div>
                                <button disabled={isLoading} className="md:col-span-2 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
                                    {isLoading ? "Salvando..." : "Cadastrar Novo Concurso"}
                                </button>
                            </form>
                        )}

                        {activeTab === "positions" && (
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                handleAction("/api/contestPosition", "POST", { ...positionForm, vacancies: Number(positionForm.vacancies), salary: Number(positionForm.salary) }, "Cargo criado!")
                            }} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Concurso Vinculado</label>
                                    <select value={positionForm.contestId} onChange={e => setPositionForm({...positionForm, contestId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                        <option value="">Selecione...</option>
                                        {contests.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Cargo</label>
                                    <input value={positionForm.name} onChange={e => setPositionForm({...positionForm, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Escolaridade</label>
                                    <select value={positionForm.schooling} onChange={e => setPositionForm({...positionForm, schooling: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                        <option value="">Selecione...</option>
                                        <option value="MEDIO">Ensino Médio</option>
                                        <option value="SUPERIOR">Ensino Superior</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Vagas</label>
                                        <input type="number" value={positionForm.vacancies} onChange={e => setPositionForm({...positionForm, vacancies: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Salário (R$)</label>
                                        <input type="number" step="0.01" value={positionForm.salary} onChange={e => setPositionForm({...positionForm, salary: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                    </div>
                                </div>
                                <button disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm">Salvar Cargo</button>
                            </form>
                        )}

                        {activeTab === "stages" && (
                            <form onSubmit={onCreateStage} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Concurso</label>
                                    <select value={stageForm.contestId} onChange={e => setStageForm({...stageForm, contestId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                        <option value="">Selecione...</option>
                                        {contests.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-3 space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Nome da Etapa</label>
                                        <input value={stageForm.name} onChange={e => setStageForm({...stageForm, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" placeholder="Ex: Prova Objetiva" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Ordem</label>
                                        <input type="number" value={stageForm.order} onChange={e => setStageForm({...stageForm, order: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Instruções/Descrição</label>
                                    <textarea value={stageForm.description} onChange={e => setStageForm({...stageForm, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium h-20" />
                                </div>
                                <button disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm">Cadastrar Etapa</button>
                            </form>
                        )}

                        {activeTab === "homologate" && (
                            <div className="space-y-6">
                                {/* Sub-navigation for Status */}
                                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                    {[
                                        { id: "PENDING", label: "Pendentes", color: "bg-amber-500" },
                                        { id: "APPROVED", label: "Aprovados", color: "bg-emerald-500" },
                                        { id: "REJECTED", label: "Reprovados", color: "bg-rose-500" }
                                    ].map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setSubTabStatus(s.id)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                                                subTabStatus === s.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.color}`}></span>
                                            {s.label}
                                            <span className="ml-1 opacity-50">
                                                ({adminSubscriptions.filter(sub => sub.status === s.id).length})
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    {adminSubscriptions
                                        .filter(sub => sub.status === subTabStatus)
                                        .map(sub => (
                                            <div key={sub.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-slate-50 transition-colors group">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{sub.user.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{sub.contest.title} • {sub.position.name}</p>
                                                </div>
                                                <button 
                                                    onClick={() => setSelectedSub(sub)} 
                                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    {subTabStatus === "PENDING" ? "Analisar" : "Ver Detalhes"}
                                                </button>
                                            </div>
                                        ))}
                                    
                                    {adminSubscriptions.filter(sub => sub.status === subTabStatus).length === 0 && (
                                        <div className="py-20 text-center space-y-2">
                                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Nada por aqui</p>
                                            <p className="text-[10px] text-slate-400">Nenhuma inscrição com status {subTabStatus.toLowerCase()} foi encontrada.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "results" && (
                            <form onSubmit={onCreateResult} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Selecionar Candidato (Inscrição)</label>
                                    <select value={resultForm.subscriptionId} onChange={e => setResultForm({...resultForm, subscriptionId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                        <option value="">Selecione um candidato...</option>
                                        {adminSubscriptions.filter(s => s.status === 'APPROVED').map(s => (
                                            <option key={s.id} value={s.id}>{s.user.name} ({s.contest.title})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Fase / Etapa</label>
                                    <select value={resultForm.stageId} onChange={e => setResultForm({...resultForm, stageId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                        <option value="">Selecione a fase...</option>
                                        {contests.find(c => c.id === adminSubscriptions.find(s => s.id === resultForm.subscriptionId)?.contestId)?.stages?.map((st: any) => (
                                            <option key={st.id} value={st.id}>{st.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Pontuação / Nota</label>
                                        <input type="number" step="0.1" value={resultForm.score} onChange={e => setResultForm({...resultForm, score: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Resultado Final</label>
                                        <select value={resultForm.result} onChange={e => setResultForm({...resultForm, result: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                            <option value="PENDING">Pendente</option>
                                            <option value="APPROVED">Aprovado</option>
                                            <option value="REJECTED">Reprovado</option>
                                            <option value="ABSENT">Ausente</option>
                                        </select>
                                    </div>
                                </div>
                                <button disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm">Salvar Resultado</button>
                            </form>
                        )}

                        {activeTab === "notices" && (
                            <form onSubmit={onFileUpload} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Concurso</label>
                                    <select value={noticeForm.contestId} onChange={e => setNoticeForm({...noticeForm, contestId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                        <option value="">Selecione...</option>
                                        {contests.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Título do Arquivo</label>
                                    <input value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" placeholder="Ex: Resultado Preliminar" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Arquivo PDF</label>
                                    <input type="file" onChange={e => setNoticeForm({...noticeForm, file: e.target.files?.[0] || null})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold" required />
                                </div>
                                <button disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm">Fazer Upload do PDF</button>
                            </form>
                        )}

                        {activeTab === "news" && (
                            <form onSubmit={onCreateNews} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Concurso</label>
                                    <select value={newsForm.contestId} onChange={e => setNewsForm({...newsForm, contestId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required>
                                        <option value="">Selecione...</option>
                                        {contests.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Título da Notícia</label>
                                    <input value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Conteúdo</label>
                                    <textarea value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium h-32" required />
                                </div>
                                <button disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm">Publicar Notícia</button>
                            </form>
                        )}
                    </div>
                </main>
            </div>

            {/* Sub Analysis Modal - Minimalist */}
            {selectedSub && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl w-full max-w-3xl p-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Análise Documental</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedSub.user.name}</p>
                            </div>
                            <button onClick={() => setSelectedSub(null)} className="text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors">&times;</button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-10 mb-10">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-tighter">Documentos Enviados</p>
                                <div className="space-y-2">
                                    {selectedSub.documents.map((doc: any, i: number) => (
                                        <a key={i} href={doc.fileUrl} target="_blank" className="block p-4 border border-slate-100 rounded-xl text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-50">
                                            {doc.type} <span className="text-blue-500 ml-2">Abrir Arquivo &rarr;</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-0 tracking-tighter">Dados do Perfil</p>
                                <div className="text-xs font-medium text-slate-600 space-y-2">
                                    <p><span className="font-bold text-slate-900">CPF:</span> {selectedSub.user.cpf}</p>
                                    <p><span className="font-bold text-slate-900">Telefone:</span> {selectedSub.user.phone}</p>
                                    <p><span className="font-bold text-slate-900">Escolaridade:</span> {selectedSub.user.schooling}</p>
                                    <p><span className="font-bold text-slate-900">Cidade:</span> {selectedSub.user.city} - {selectedSub.user.state}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-8 border-t border-slate-100">
                            <button onClick={() => handleUpdateSubStatus(selectedSub.id, "APPROVED")} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black">Aprovar Inscrição</button>
                            <button onClick={() => handleUpdateSubStatus(selectedSub.id, "REJECTED")} className="flex-1 py-4 border border-rose-200 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50">Rejeitar Inscrição</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
