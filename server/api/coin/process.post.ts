// server/api/coin/process.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const parts = await readMultipartFormData(event);
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "No file provided" });
  }

  const form = new FormData();
  for (const part of parts) {
    if (part.filename) {
      form.append(
        part.name ?? "file",
        new Blob([part.data], {
          type: part.type ?? "application/octet-stream",
        }),
        part.filename
      );
    } else {
      form.append(part.name ?? "", part.data.toString());
    }
  }

  const result = await $fetch(`${config.aiServiceUrl}/api/process-image`, {
    method: "POST",
    body: form,
  });

  return result;
});
