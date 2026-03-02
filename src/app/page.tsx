import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CalendarCheck, ShieldCheck, Users, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Landing Navbar Custom (simpler than app navbar) */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">VLab Events</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex">Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Teste Agora</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 bg-gradient-to-b from-background to-muted/50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="space-y-6 max-w-3xl mx-auto flex flex-col items-center">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-4">
                Desafio Técnico VLab
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Gestão Inteligente de Eventos e Check-ins
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Plataforma completa para controle de eventos, participantes e validações de regras complexas de entrada. Construído para ser rápido, acessível e seguro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2 group">
                    Fazer um Teste
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Área Logada (Login)
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Use <strong className="text-foreground">admin@vlab.com</strong> / <strong className="text-foreground">123</strong> para testar.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Como funciona a Plataforma</h2>
              <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Tudo o que você precisa para gerenciar inscrições num único lugar, com interface moderna focada em produtividade.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Controle de Eventos</h3>
                <p className="text-muted-foreground">
                  Crie, edite e acompanhe eventos com informações precisas de datas, locais e status tudo no seu dashboard.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gestão de Participantes</h3>
                <p className="text-muted-foreground">
                  Inscrições rápidas, edição cadastral e também transferência ágil de participantes entre eventos diferentes.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Regras de Check-in</h3>
                <p className="text-muted-foreground">
                  Motor de validação para configurar se o evento exige restrições de horários, pagamento e documentos sem atritos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-20 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">O que dizem sobre o VLab</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-xl border bg-background shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(star => <span key={star} className="text-yellow-500 text-lg">★</span>)}
                </div>
                <p className="italic text-muted-foreground mb-6">
                  "Finalmente uma ferramenta que impede gargalos duplos (Documento + Pagamento) nas recepções de evento. As regras de check-in são a melhor feature!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div>
                    <div className="font-semibold text-sm">Mariana Souza</div>
                    <div className="text-xs text-muted-foreground">Produtora de Eventos</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-xl border bg-background shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(star => <span key={star} className="text-yellow-500 text-lg">★</span>)}
                </div>
                <p className="italic text-muted-foreground mb-6">
                  "O visual escuro da plataforma me ajuda a passar horas no dashboard de inscrições sem cansar os olhos. Trabalho com festivais e essa fluidez não tem preço."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div>
                    <div className="font-semibold text-sm">Carlos Mendonça</div>
                    <div className="text-xs text-muted-foreground">Gestor de Festivais</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-xl border bg-background shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(star => <span key={star} className="text-yellow-500 text-lg">★</span>)}
                </div>
                <p className="italic text-muted-foreground mb-6">
                  "Transferir um participante que desistiu de um dia do workshop pro outro era uma dor de cabeça em planilhas. Aqui com dois cliques está resolvido."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div>
                    <div className="font-semibold text-sm">Roberto Nunes</div>
                    <div className="text-xs text-muted-foreground">Diretor de Operações</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Pronto para transformar sua gestão?
            </h2>
            <p className="md:text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Junte-se à revolução na operação de check-ins rápidos. 
              Clique abaixo e descubra a performance da nossa aplicação.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="font-semibold px-8 hover:bg-secondary/90 text-primary">
                Acessar o Sistema
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 VLab. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">Termos</Link>
            <Link href="#" className="hover:underline">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
