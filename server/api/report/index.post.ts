// server/api/report/index.post.ts
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  // 1. ตรวจสอบ session ผู้ใช้
  const session = await getUserSession(event);
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // 2. อ่านค่า ids จาก body ของ request
  const { ids } = await readBody(event);
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDs are required and must be a non-empty array.",
    });
  }

  // 3. ค้นหาข้อมูลจากฐานข้อมูล
  const historyRecords = await db.processingHistory.findMany({
    where: {
      // ค้นหาเฉพาะ id ที่อยู่ใน list และเป็นของ user คนปัจจุบันเท่านั้น (เพื่อความปลอดภัย)
      id: {
        in: ids,
      },
      userId: session.user.id,
    },
    include: {
      details: true, // ดึงรายละเอียดเหรียญ (CoinDetail) มาด้วย
    },
  });

  // 4. ตรวจสอบว่าจำนวนข้อมูลที่ได้มาตรงกับที่ขอหรือไม่ (อาจไม่จำเป็น แต่เป็น good practice)
  if (historyRecords.length !== ids.length) {
    console.warn(
      "Some history records were not found or do not belong to the user."
    );
    // เราจะไม่ throw error แต่จะส่งคืนเฉพาะข้อมูลที่หาเจอและมีสิทธิ์เข้าถึง
  }

  // 5. ส่งข้อมูลกลับไป
  return historyRecords;
});
