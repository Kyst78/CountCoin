// server/api/account/stats.get.ts
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = session.user.id;

  // ใช้ Prisma Aggregate เพื่อนับจำนวนและรวมยอด
  const stats = await db.processingHistory.aggregate({
    where: {
      userId: userId,
    },
    _count: {
      id: true, // นับจำนวนแถว (จำนวนครั้งที่ประมวลผล)
    },
    _sum: {
      totalValue: true, // รวมยอดเงินทั้งหมด
    },
  });

  return {
    scanCount: stats._count.id,
    totalValueSum: stats._sum.totalValue ?? 0, // ถ้ายังไม่เคยมีข้อมูลให้เป็น 0
  };
});
