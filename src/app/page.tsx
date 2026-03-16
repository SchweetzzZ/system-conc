import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              SISTEMA CONCURSOS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#sobre" className="hover:text-blue-600 transition-colors">Sobre</Link>
            <Link href="#concursos" className="hover:text-blue-600 transition-colors">Editais Abertos</Link>
            <Link href="#contato" className="hover:text-blue-600 transition-colors">Contato</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
            >
              Inscrever-se
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Novo Edital Disponível: Concurso Nacional 2026
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8 text-slate-900">
            Sua carreira pública <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-300% animate-gradient">começa aqui.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed">
            Plataforma unificada para gestão de concursos, acompanhamento de etapas e recebimento de notificações em tempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
            >
              Ver Editais Abertos
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all">
              Como Funciona
            </button>
          </div>
        </div>
      </section>

      {/* Featured Statistics */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm">
                <div className="text-4xl font-black text-blue-600 mb-2">150+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Cargos</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm">
                <div className="text-4xl font-black text-blue-600 mb-2">12k</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Inscritos</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm">
                <div className="text-4xl font-black text-blue-600 mb-2">R$ 5k+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Salários</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm">
                <div className="text-4xl font-black text-blue-600 mb-2">100%</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Digital</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Snippet */}
      <section id="sobre" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
                <div className="aspect-square bg-blue-600 rounded-[4rem] rotate-3 overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-800 mix-blend-overlay"></div>
                   <div className="p-12 text-white h-full flex flex-col justify-end">
                        <div className="text-6xl font-black mb-4 italic opacity-20">"Digital"</div>
                        <p className="text-xl font-medium leading-relaxed">Acompanhe cada etapa do seu concurso na palma da mão, com notificações enviadas direto para seu e-mail.</p>
                   </div>
                </div>
            </div>
            <div className="space-y-8">
                <h2 className="text-5xl font-black text-slate-900 leading-tight">Gestão simplificada, <br /> resultados rápidos.</h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Notificações por E-mail</h4>
                            <p className="text-slate-500">Nunca perca um prazo. Receba alertas automáticos de novas etapas e convocações.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Upload de Documentos</h4>
                            <p className="text-slate-500">Envie seus títulos e documentos de forma segura e receba o feedback da banca digitalmente.</p>
                        </div>
                    </div>
                </div>
                <div className="pt-4">
                   <Link href="/register" className="font-bold text-blue-600 hover:underline">Começar agora &rarr;</Link>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight">Sistema Concursos</span>
          </div>
          <div className="text-slate-400 text-sm">
            &copy; 2026 Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-slate-400">
            <Link href="#" className="hover:text-slate-900 transition-colors">Termos</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
