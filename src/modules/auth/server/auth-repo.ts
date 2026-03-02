import prisma from "@/lib/prisma"

export const authRepo = {
    findUserByEmail: async (email: string) => {
        return prisma.user.findUnique({
            where: { email }
        })
    },
    createUser: async (data: { email: string; senha: string; nome?: string }) => {
        return prisma.user.create({
            data
        })
    }
}
