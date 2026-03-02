import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('123', 10)

    const user = await prisma.user.upsert({
        where: { email: 'admin@eventflow.com' },
        update: {
            senha: hashedPassword
        },
        create: {
            email: 'admin@eventflow.com',
            senha: hashedPassword,
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
                    { nome: 'Check-in Antecipado', tipo: 'HORARIO', ativa: true },
                    { nome: 'Documento c/ Foto', tipo: 'DOCUMENTO', ativa: true },
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
