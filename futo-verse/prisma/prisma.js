import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === 'production'){
    prisma = new PrismaClient()
} else {
    if(!global.prisma){
        global.prisma = new PrismaClient({
            log: ['info'],
        })
        console.log('Prisma Client established ...')
    }
    prisma = global.prisma
    console.log('Prisma Client already established ...')
}

export default prisma