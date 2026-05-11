import { getAuthHeaders } from "./auth";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const auth = await getAuthHeaders();
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...auth,
      ...(init?.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...init,
  });

  if (!res.ok) {
    let parsed: unknown = null;
    try {
      parsed = await res.json();
    } catch {
      parsed = await res.text();
    }
    throw new ApiError(res.status, `API ${method} ${path} failed: ${res.status}`, parsed);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
  rawDownload: async (path: string): Promise<Blob> => {
    const auth = await getAuthHeaders();
    const res = await fetch(`${BASE}${path}`, { headers: auth, credentials: "include" });
    if (!res.ok) throw new ApiError(res.status, `download failed: ${res.status}`, null);
    return res.blob();
  },
};
