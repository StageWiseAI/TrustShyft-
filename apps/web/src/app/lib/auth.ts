/**
 * Phase 1 Clerk auth placeholder.
 *
 * The real implementation will use @clerk/clerk-react: a ClerkProvider at the
 * root, useUser/useAuth hooks here, and a session-token fetch piped into the
 * api client below. For now we expose a tiny, swap-shaped surface so the rest
 * of the app can be wired up without Clerk being live.
 */
export interface ClientAuthContext {
  user_id: string;
  organisation_id: string;
  role: "owner" | "admin" | "reviewer" | "viewer";
}

const DEV_AUTH: ClientAuthContext = {
  user_id: import.meta.env.VITE_DEV_USER_ID ?? "00000000-0000-0000-0000-000000000001",
  organisation_id:
    import.meta.env.VITE_DEV_ORG_ID ?? "00000000-0000-0000-0000-0000000000aa",
  role: "admin",
};

export function getClientAuth(): ClientAuthContext {
  return DEV_AUTH;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const ctx = getClientAuth();
  return {
    "x-dev-user-id": ctx.user_id,
    "x-dev-organisation-id": ctx.organisation_id,
    "x-dev-role": ctx.role,
  };
}
