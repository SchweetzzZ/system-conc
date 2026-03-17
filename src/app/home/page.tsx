"use client"
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

// Components
const StatCard = ({ title, value }: { title: string, value: string | number }) => (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className={`text-3xl font-bold text-slate-900`}>{value}</p>
    </div>
)

const NotificationItem = ({ title, message, date, read }: { title: string, message: string, date: string, read: boolean }) => (
    <div className={`p-5 rounded-2xl border transition-all ${read ? 'border-slate-100 opacity-60' : 'border-slate-200 bg-white shadow-sm'}`}>
        <div className="flex justify-between items-start mb-1">
            <h4 className="text-xs font-bold text-slate-900">{title}</h4>
            <span className="text-[10px] font-bold text-slate-400">{date}</span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{message}</p>
    </div>
)

export default function Dashboard() {
    const { data: session, status } = useSession()
    const [activeTab, setActiveTab] = useState("overview")
    const [notifications, setNotifications] = useState<any[]>([])
    const [contests, setContests] = useState<any[]>([])
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [profile, setProfile] = useState<any>(null)
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isSavingProfile, setIsSavingProfile] = useState(false)

    // Inscription Flow State
    const [subStep, setSubStep] = useState(1)
    const [selectedContest, setSelectedContest] = useState<any>(null)
    const [selectedPosition, setSelectedPosition] = useState<any>(null)
    const [uploadedDocs, setUploadedDocs] = useState<{ type: string, fileUrl: string, fileKey: string }[]>([])

    const fetchData = useCallback(async () => {
        if (!session) return
        setIsLoadingData(true)
        try {
            const [notifRes, contestRes, subRes, profileRes] = await Promise.all([
                fetch('/api/notification'),
                fetch('/api/contest'),
                fetch('/api/subscription'),
                fetch('/api/user/profile')
            ])
            if (notifRes.ok) setNotifications(await notifRes.json())
            if (contestRes.ok) setContests(await contestRes.json())
            if (subRes.ok) setSubscriptions(await subRes.json())
            if (profileRes.ok) setProfile(await profileRes.json())
        } catch (err) { console.error(err) }
        finally { setIsLoadingData(false) }
    }, [session])

    useEffect(() => {
        if (status === "unauthenticated") redirect("/login")
        if (session) fetchData()
    }, [status, session, fetchData])

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSavingProfile(true)
        const formData = Object.fromEntries(new FormData(e.currentTarget))
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.ok) { setProfile(await res.json()); alert("✅ Perfil atualizado!") }
            else { alert("❌ Erro ao salvar.") }
        } catch (err) { alert("⚠️ Erro de rede") }
        finally { setIsSavingProfile(false) }
    }

    const getMissingFields = () => {
        if (!profile) return ['Perfil não carregado']
        const required = [
            { key: 'cpf', label: 'CPF' },
            { key: 'phone', label: 'Telefone' },
            { key: 'street', label: 'Rua' },
            { key: 'city', label: 'Cidade' },
            { key: 'state', label: 'Estado (UF)' },
            { key: 'zipCode', label: 'CEP' },
            { key: 'schooling', label: 'Escolaridade' },
            { key: 'birthDate', label: 'Data de Nascimento' }
        ]
        return required
            .filter(field => !profile[field.key] || String(profile[field.key]).trim() === '')
            .map(field => field.label)
    }

    const isProfileComplete = () => getMissingFields().length === 0

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const preRes = await fetch('/api/upload/presigned', { method: 'POST', body: JSON.stringify({ fileName: file.name, contentType: file.type, fileSize: file.size }) })
            const { data } = await preRes.json()
            await fetch(data.uploadUrl, { method: 'PUT', body: file })
            setUploadedDocs(prev => [...prev.filter(d => d.type !== type), { type, fileUrl: data.fileUrl, fileKey: data.fileKey }])
            alert(`✅ ${type} carregado!`)
        } catch (err) { alert("Erro no upload") }
    }

    const handleSubscriptionSubmit = async () => {
        if (uploadedDocs.length < 2) return alert("Envie RG e Comprovante.")
        try {
            const res = await fetch('/api/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contestId: selectedContest.id, positionId: selectedPosition.id, documents: uploadedDocs })
            })
            if (res.ok) { alert("🎉 Inscrição Realizada!"); fetchData(); setActiveTab('subscriptions'); setSubStep(1); setUploadedDocs([]) }
            else { alert("❌ Erro na inscrição.") }
        } catch (err) { alert("⚠️ Erro") }
    }

    if (status === "loading") return <div className="h-screen flex items-center justify-center font-bold text-slate-300">Carregando...</div>

    const menu = [
        { id: "overview", label: "Início", icon: "🏠" },
        { id: "contests", label: "Editais Abertos", icon: "📄" },
        { id: "subscriptions", label: "Minhas Inscrições", icon: "✍️" },
        { id: "notifications", label: "Mensagens", icon: "🔔" },
        { id: "profile", label: "Meu Perfil", icon: "👤" },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900">
            {/* Minimalist Sidebar */}
            <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-10 px-2">
                    <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-[10px] text-white">C</div>
                    <span className="text-sm font-bold tracking-tight uppercase">Candidato</span>
                </div>

                <nav className="space-y-1 flex-1">
                    {menu.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <span>{item.icon}</span> {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <button onClick={() => signOut()} className="w-full py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg">Sair da Conta</button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 p-8 md:p-12 lg:p-16 max-w-5xl">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight uppercase">{menu.find(i => i.id === activeTab)?.label}</h1>
                    <p className="text-xs font-medium text-slate-400 mt-1">{profile?.name || session?.user?.name}</p>
                </header>

                <div>
                    {activeTab === "overview" && (
                        <div className="space-y-10">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <StatCard title="Inscrições" value={subscriptions.length} />
                                <StatCard title="Novos Editais" value={contests.length} />
                                <StatCard title="Mensagens" value={notifications.length} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Notificações Recentes</h2>
                                    <div className="space-y-3">
                                        {notifications.slice(0, 3).map((n, i) => <NotificationItem key={i} {...n} date={new Date(n.createdAt).toLocaleDateString()} />)}
                                        {notifications.length === 0 && <p className="text-[10px] text-slate-300 font-bold">Sem novidades por enquanto.</p>}
                                    </div>
                                </div>
                                <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-center">
                                    <h3 className="text-lg font-bold mb-2">Complete seu Perfil</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed mb-6">Para validar sua inscrição, precisamos que seus dados básicos estejam atualizados.</p>
                                    <button onClick={() => setActiveTab('profile')} className="px-6 py-3 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Verificar Dados</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "contests" && (
                        <div className="grid gap-6">
                            {contests.map(c => (
                                <div key={c.id} className="p-8 bg-white border border-slate-200 rounded-2xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{c.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        <div><p className="text-[9px] font-bold text-slate-400 uppercase">Inscrições Até</p><p className="text-xs font-bold">{new Date(c.registrationEnd).toLocaleDateString()}</p></div>
                                        <div><p className="text-[9px] font-bold text-slate-400 uppercase">Prova</p><p className="text-xs font-bold">{new Date(c.examDate).toLocaleDateString()}</p></div>
                                    </div>

                                    <div className="space-y-4 border-t border-slate-50 pt-6">
                                        <p className="text-[10px] font-bold uppercase text-slate-400">Documentos Oficiais</p>
                                        <div className="flex flex-wrap gap-2">
                                            {c.notices?.map((n: any) => (
                                                <a key={n.id} href={n.fileUrl} target="_blank" className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100">📎 {n.title}</a>
                                            ))}
                                            {c.notices?.length === 0 && <p className="text-[10px] text-slate-300">Nenhum edital publicado ainda.</p>}
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-3">
                                        {!isProfileComplete() && (
                                            <div className="text-[10px] font-bold text-rose-500 bg-rose-50 p-4 rounded-xl space-y-2">
                                                <p>⚠️ Inscrição bloqueada. Complete seu perfil:</p>
                                                <ul className="list-disc list-inside grid grid-cols-2 gap-1 opacity-70">
                                                    {getMissingFields().map(f => <li key={f}>{f}</li>)}
                                                </ul>
                                                <button onClick={() => setActiveTab('profile')} className="mt-2 text-rose-600 underline">Ir para Meu Perfil &rarr;</button>
                                            </div>
                                        )}
                                        <button
                                            disabled={!isProfileComplete()}
                                            onClick={() => { setSelectedContest(c); setSubStep(1); setActiveTab('contests_flow'); }}
                                            className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                        >
                                            Iniciar Inscrição
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'contests_flow' && (
                        <div className="max-w-2xl bg-white border border-slate-200 p-10 rounded-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <button onClick={() => setActiveTab('contests')} className="text-slate-400">←</button>
                                <h3 className="text-lg font-bold">Nova Inscrição: {selectedContest?.title}</h3>
                            </div>

                            {subStep === 1 ? (
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Escolha o Cargo</label>
                                        <select onChange={(e) => setSelectedPosition(selectedContest?.positions.find((p: any) => p.id === e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none">
                                            <option value="">Selecione...</option>
                                            {selectedContest?.positions.map((p: any) => <option key={p.id} value={p.id}>{p.name} - R$ {p.salary}</option>)}
                                        </select>
                                    </div>
                                    <button disabled={!selectedPosition} onClick={() => setSubStep(2)} className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase disabled:opacity-50">Próximo Passo &rarr;</button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <p className="text-xs font-medium text-slate-500">Faça o upload dos documentos obrigatórios (PDF ou Imagem):</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                            <p className="text-[10px] font-bold mb-3 uppercase">RG / Identidade</p>
                                            <input type="file" onChange={(e) => handleFileUpload(e, "RG")} className="text-[10px] w-full" />
                                            {uploadedDocs.find(d => d.type === "RG") && <p className="text-[10px] text-green-600 font-bold mt-2">✓ Carregado</p>}
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                            <p className="text-[10px] font-bold mb-3 uppercase">Comprovante Residência</p>
                                            <input type="file" onChange={(e) => handleFileUpload(e, "RESIDENCIA")} className="text-[10px] w-full" />
                                            {uploadedDocs.find(d => d.type === "RESIDENCIA") && <p className="text-[10px] text-green-600 font-bold mt-2">✓ Carregado</p>}
                                        </div>
                                    </div>
                                    <button onClick={handleSubscriptionSubmit} className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase">Finalizar Inscrição</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "subscriptions" && (
                        <div className="space-y-6">
                            {subscriptions.map((sub, i) => (
                                <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <span className="text-[9px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">Protocolo: {sub.id.slice(0, 8)}</span>
                                            <h3 className="text-lg font-bold mt-2">{sub.contest?.title}</h3>
                                            <p className="text-xs font-medium text-slate-400">{sub.position?.name}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase ${sub.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                                            }`}>
                                            {sub.status}
                                        </div>
                                    </div>

                                    {/* Timeline/Stages */}
                                    <div className="border-t border-slate-50 pt-6">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-tighter">Etapas e Resultados</p>
                                        <div className="space-y-3">
                                            {sub.contest?.stages?.map((stage: any) => {
                                                const res = sub.results?.find((r: any) => r.stageId === stage.id);
                                                return (
                                                    <div key={stage.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                        <div>
                                                            <p className="text-xs font-bold">{stage.name}</p>
                                                            <p className="text-[10px] text-slate-400">{stage.description}</p>
                                                        </div>
                                                        {res ? (
                                                            <div className="text-right">
                                                                <p className="text-xs font-bold text-slate-900">Nota: {res.score}</p>
                                                                <p className={`text-[9px] font-bold uppercase ${res.result === 'APPROVED' ? 'text-green-600' : 'text-rose-500'}`}>{res.result}</p>
                                                            </div>
                                                        ) : <span className="text-[10px] font-bold text-slate-300 uppercase">Pendente</span>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <form onSubmit={handleProfileUpdate} className="max-w-3xl bg-white border border-slate-200 p-10 rounded-2xl grid md:grid-cols-2 gap-6">
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">Nome</label><input disabled value={profile?.name} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium opacity-50" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">CPF</label><input name="cpf" defaultValue={profile?.cpf} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">Nascimento</label><input type="date" name="birthDate" defaultValue={profile?.birthDate?.split('T')[0]} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">Telefone</label><input name="phone" defaultValue={profile?.phone} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" /></div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Escolaridade</label>
                                <select name="schooling" defaultValue={profile?.schooling} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium">
                                    <option value="">Selecione...</option>
                                    <option value="MEDIO">Ensino Médio</option>
                                    <option value="SUPERIOR">Ensino Superior</option>
                                </select>
                            </div>
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">CEP</label><input name="zipCode" defaultValue={profile?.zipCode} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" /></div>
                            <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">Endereço / Rua</label><input name="street" defaultValue={profile?.street} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">Cidade</label><input name="city" defaultValue={profile?.city} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-slate-400">Estado (UF)</label><input name="state" defaultValue={profile?.state} maxLength={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" placeholder="Ex: RJ" /></div>
                            <button disabled={isSavingProfile} className="md:col-span-2 py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase mt-4 disabled:opacity-50">
                                {isSavingProfile ? "Salvando..." : "Salvar Alterações"}
                            </button>
                            {!isProfileComplete() && (
                                <div className="md:col-span-2 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-[10px] font-bold text-amber-700 uppercase mb-2">Campos Pendentes:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {getMissingFields().map(f => (
                                            <span key={f} className="px-2 py-1 bg-white border border-amber-200 rounded text-[9px] font-bold text-amber-600">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>
                    )}

                    {activeTab === "notifications" && (
                        <div className="grid gap-4 max-w-2xl">
                            {notifications.map((n, i) => <NotificationItem key={i} {...n} date={new Date(n.createdAt).toLocaleDateString()} />)}
                            {notifications.length === 0 && <p className="p-10 text-center text-xs font-medium text-slate-400 border border-dashed border-slate-200 rounded-2xl">Nenhuma mensagem recente.</p>}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
