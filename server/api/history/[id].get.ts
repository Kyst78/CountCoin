// server/api/history/[id].get.ts
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const historyId = event.context.params?.id as string;
  if (!historyId) {
    throw createError({ statusCode: 400, statusMessage: "Missing history ID" });
  }

  const historyDetail = await db.processingHistory.findUnique({
    where: {
      id: historyId,
    },
    include: {
      details: true, // ดึงรายละเอียดเหรียญมาด้วย
    },
  });

  // ตรวจสอบว่าเป็นเจ้าของข้อมูลจริง
  if (!historyDetail || historyDetail.userId !== session.user.id) {
    throw createError({ statusCode: 404, statusMessage: "History not found" });
  }

  return historyDetail;
});
