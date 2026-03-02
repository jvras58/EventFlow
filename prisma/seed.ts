import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const user = await prisma.user.upsert({
        where: { email: 'admin@eventflow.com' },
        update: {
            passwordHash: hashedPassword
        },
        create: {
            email: 'admin@eventflow.com',
            passwordHash: hashedPassword,
        },
    })

    // Create Evento keeping it simple
    const evento = await prisma.evento.create({
        data: {
            nome: 'EventFlow Conf 2026',
            data: new Date(new Date().setHours(new Date().getHours() + 48)),
            local: 'São Paulo, SP',
            regras: {
                create: [
                    { nomeRegra: 'Acesso Prime', ativo: true, obrigatorio: true, liberarMinAntes: 120, encerrarMinDepois: 0 },
                    { nomeRegra: 'Documento c/ Foto', ativo: true, obrigatorio: true, liberarMinAntes: 60, encerrarMinDepois: 60 },
                ]
            }
        }
    })

    console.log('Seed executado com sucesso!', { userEmail: user.email, eventoNome: evento.nome })
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
