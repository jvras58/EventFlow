import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    await prisma.evento.deleteMany()

    const hashedPassword = await bcrypt.hash('test123', 10)

    const user = await prisma.user.create({
        data: {
            email: 'test@eventflow.com',
            passwordHash: hashedPassword,
            nome: 'Teste EventFlow'
        }
    })

    const eventoEventoFlowConf = await prisma.evento.create({
        data: {
            nome: 'EventFlow Conf 2026',
            data: new Date(new Date().setHours(new Date().getHours() + 48)),
            local: 'São Paulo, SP',
            status: 'ATIVO',
            regras: {
                create: [
                    { nomeRegra: 'Acesso Prime', ativo: true, obrigatorio: true, liberarMinAntes: 120, encerrarMinDepois: 0 },
                    { nomeRegra: 'Documento c/ Foto', ativo: true, obrigatorio: true, liberarMinAntes: 60, encerrarMinDepois: 60 },
                ]
            },
            participantes: {
                create: [
                    { nome: 'João Silva', email: 'joao.silva@example.com', checkIn: true },
                    { nome: 'Maria Lima', email: 'maria.lima@example.com', checkIn: false },
                    { nome: 'Carlos Souza', email: 'carlos.souza@example.com', checkIn: false }
                ]
            }
        },
        include: {
            participantes: true,
            regras: true
        }
    })

    const eventoWorkshop = await prisma.evento.create({
        data: {
            nome: 'Workshop Next.js e Prisma',
            data: new Date(new Date().setHours(new Date().getHours() - 48)),
            local: 'Rio de Janeiro, RJ (Online)',
            status: 'ENCERRADO',
            regras: {
                create: [
                    { nomeRegra: 'Credencial Simples', ativo: true, obrigatorio: true, liberarMinAntes: 30, encerrarMinDepois: 30 },
                ]
            },
            participantes: {
                create: [
                    { nome: 'Ana Costa', email: 'ana.costa@example.com', checkIn: true },
                    { nome: 'Pedro Alves', email: 'pedro.alves@example.com', checkIn: true }
                ]
            }
        },
        include: {
            participantes: true,
            regras: true
        }
    })

    const eventoPendente = await prisma.evento.create({
        data: {
            nome: 'Encontro de Comunidade',
            data: new Date(new Date().setHours(new Date().getHours() + 120)),
            local: 'Curitiba, PR',
            status: 'PENDENTE',
            participantes: {
                create: [
                    { nome: 'Lucas Mendes', email: 'lucas.mendes@example.com', checkIn: false }
                ]
            }
        },
        include: {
            participantes: true,
            regras: true
        }
    })

    console.log('✅ Seed executado com sucesso!\n')
    console.log('--- Resumo do Banco de Dados ---')
    console.log(`👤 Administrador: ${user.nome} (${user.email})`)
    console.log(`📅 Evento 1: ${eventoEventoFlowConf.nome} [${eventoEventoFlowConf.status}] - ${eventoEventoFlowConf.participantes.length} participantes, ${eventoEventoFlowConf.regras.length} regras`)
    console.log(`📅 Evento 2: ${eventoWorkshop.nome} [${eventoWorkshop.status}] - ${eventoWorkshop.participantes.length} participantes, ${eventoWorkshop.regras.length} regras`)
    console.log(`📅 Evento 3: ${eventoPendente.nome} [${eventoPendente.status}] - ${eventoPendente.participantes.length} participantes, ${eventoPendente.regras.length} regras`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
