import { PrismaClient } from "@prisma/client";

// ✅ Prisma 7 ต้องส่ง options object (แม้จะว่างก็ได้)
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;