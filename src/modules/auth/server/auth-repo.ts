import prisma from "@/lib/prisma"

export const authRepo = {
    findUserByEmail: async (email: string) => {
        return prisma.user.findUnique({
            where: { email }
        })
    }
}
