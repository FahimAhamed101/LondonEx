import type { User } from "@/features/auth/auth.types";

const AUTH_ACCESS_TOKEN_KEY = "auth-access-token";
const AUTH_REFRESH_TOKEN_KEY = "auth-refresh-token";
const AUTH_USER_KEY = "auth-user";

export type StoredAuthSession = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
};

export function loadAuthSession(): StoredAuthSession {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
    };
  }

  const accessToken = window.localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  let user: User | null = null;

  if (rawUser) {
    try {
      user = JSON.parse(rawUser) as User;
    } catch {
      user = null;
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export function persistAuthSession(session: StoredAuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  if (session.accessToken) {
    window.localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, session.accessToken);
  } else {
    window.localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  }

  if (session.refreshToken) {
    window.localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, session.refreshToken);
  } else {
    window.localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  }

  if (session.user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
  } else {
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}
