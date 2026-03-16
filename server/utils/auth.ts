import type { User } from "@prisma/client";

export const sanitizeUser = (user: User) => {
  if (!user) return null;

  const { hashedPassword: _removed, ...safeUser } = user;
  return safeUser;
};
