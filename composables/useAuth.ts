// composables/useAuth.ts
export const useAuth = () => {
  const { user, clear } = useUserSession();

  const signOut = async ({ callbackUrl }: { callbackUrl: string }) => {
    await clear();
    await navigateTo(callbackUrl);
  };

  return {
    user,
    signOut,
  };
};
