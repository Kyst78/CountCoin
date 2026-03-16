// composables/useUser.ts
export const useUser = () => {
  return useState<{
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  } | null>("user", () => null);
};
