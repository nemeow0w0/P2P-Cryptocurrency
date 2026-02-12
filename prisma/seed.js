import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Start seeding...');
  // 1. ล้างข้อมูลเก่า (ถ้ามี)
  await prisma.transfer.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.user.deleteMany();

  // 2. สร้าง Assets (Fiat & Crypto)
  const thb = await prisma.asset.create({
    data: { symbol: "THB", name: "Thai Baht", type: "fiat" },
  });
  const btc = await prisma.asset.create({
    data: { symbol: "BTC", name: "Bitcoin", type: "crypto" },
  });

  // 3. สร้าง Users
  const password = await bcrypt.hash("123456", 10);
  const userA = await prisma.user.create({
    data: { username: "UserA", email: "a@test.com", password },
  });
  const userB = await prisma.user.create({
    data: { username: "UserB", email: "b@test.com", password },
  });

  // 4. สร้าง Wallets ให้แต่ละคน
  // User A: มีเงินบาท 1,000,000 แต่ไม่มี BTC
  await prisma.wallet.create({
    data: { userId: userA.id, assetId: thb.id, balance: 1000000 },
  });
  await prisma.wallet.create({
    data: { userId: userA.id, assetId: btc.id, balance: 0 },
  });

  // User B: มี 5 BTC แต่ไม่มีเงินบาท
  await prisma.wallet.create({
    data: { userId: userB.id, assetId: thb.id, balance: 0 },
  });
  await prisma.wallet.create({
    data: { userId: userB.id, assetId: btc.id, balance: 5 },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
