// server/api/history/index.get.ts
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const historyList = await db.processingHistory.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      // เลือกเฉพาะฟิลด์ที่จำเป็นสำหรับหน้า list
      id: true,
      totalCount: true,
      totalValue: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc", // เรียงจากใหม่สุดไปเก่าสุด
    },
  });

  return historyList;
});
