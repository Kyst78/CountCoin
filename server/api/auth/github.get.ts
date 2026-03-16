import db from "~/utils/db";
import { sanitizeUser } from "~/server/utils/auth";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
    scope: ["read:user", "user:email"], // ขอสิทธิ์ดึงข้อมูลโปรไฟล์และอีเมล
  },
  async onSuccess(event, { user }) {
    // กำหนด fallback สำหรับ name และ avatar_url
    const githubName = user.name ?? user.login ?? "No Name";
    const githubAvatarUrl = user.avatar_url ?? "";

    // หา user ใน DB ตาม email
    let currentUser = await db.user.findUnique({
      where: { email: user.email },
    });

    if (currentUser) {
      // ถ้าพบ user แล้ว เช็คว่า name หรือ avatarUrl ยังว่างหรือ null ไหม ถ้าว่างก็อัปเดต
      const updateData: any = {};
      if (!currentUser.name) updateData.name = githubName;
      if (!currentUser.avatarUrl) updateData.avatarUrl = githubAvatarUrl;

      if (Object.keys(updateData).length > 0) {
        currentUser = await db.user.update({
          where: { id: currentUser.id },
          data: updateData,
        });
      }
    } else {
      // ถ้าไม่มี user ให้สร้างใหม่พร้อมข้อมูล fallback
      currentUser = await db.user.create({
        data: {
          email: user.email,
          name: githubName,
          avatarUrl: githubAvatarUrl,
        },
      });
    }

    // ตรวจสอบบัญชี OAuth ว่ามีใน DB หรือยัง
    const oAuthAccount = await db.oauthAccount.findFirst({
      where: { userId: currentUser.id },
    });

    if (!oAuthAccount) {
      await db.oauthAccount.create({
        data: {
          userId: currentUser.id,
          providerId: "github",
          providerUserId: String(user.id),
        },
      });
    }

    // sanitize user ก่อนเซ็ต session
    const transformedUser = sanitizeUser(currentUser);

    if (transformedUser) {
      await setUserSession(event, { user: transformedUser });
    }

    // redirect หลังล็อกอินสำเร็จ
    return sendRedirect(event, "/");
  },
  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
