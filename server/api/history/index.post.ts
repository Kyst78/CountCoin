// server/api/history/index.post.ts
import db from "~/utils/db";
import { historySaveSchema } from "~/utils/schemas";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = session.user.id;
  const { count, totalValue, details } =
    await readValidatedBody(event, (body) => historySaveSchema.parse(body));

  // ไม่เก็บ labeledImage ใน DB เพื่อลขนาด payload
  const newHistory = await db.processingHistory.create({
    data: {
      totalCount: count,
      totalValue: totalValue,
      labeledImage: null, // ไม่เก็บรูปใน DB
      user: {
        connect: { id: userId },
      },
      details: {
        create: details.map((detail) => ({
          type: detail.type,
          count: detail.count,
          value: detail.value,
        })),
      },
    },
  });

  return newHistory;
});
