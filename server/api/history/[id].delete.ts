// server/api/history/[id].delete.ts
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = session.user.id;
  const historyId = getRouterParam(event, "id");

  if (!historyId) {
    throw createError({ statusCode: 400, statusMessage: "History ID is required" });
  }

  // ตรวจสอบว่าเป็นประวัติของ user คนนี้จริงไหม
  const history = await db.processingHistory.findFirst({
    where: {
      id: historyId,
      userId: userId,
    },
  });

  if (!history) {
    throw createError({ statusCode: 404, statusMessage: "History not found" });
  }

  // ลบประวัติ (cascade delete จะลบ details ด้วย)
  await db.processingHistory.delete({
    where: {
      id: historyId,
    },
  });

  return { success: true, message: "History deleted successfully" };
});
