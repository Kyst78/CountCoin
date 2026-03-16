// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
