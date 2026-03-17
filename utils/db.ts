import pkg from '@prisma/client'
const { PrismaClient } = pkg as any

declare global {
    var prisma: InstanceType<typeof PrismaClient> | undefined
}

const db = globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== 'production') globalThis.prisma = db 

export default db;