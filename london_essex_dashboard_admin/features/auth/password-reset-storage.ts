const PASSWORD_RESET_EMAIL_KEY = "password-reset-email";
const PASSWORD_RESET_TOKEN_KEY = "password-reset-token";

type PasswordResetContext = {
  email: string;
  token: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readPasswordResetContext(): PasswordResetContext {
  if (!canUseStorage()) {
    return {
      email: "",
      token: "",
    };
  }

  return {
    email: window.sessionStorage.getItem(PASSWORD_RESET_EMAIL_KEY) ?? "",
    token: window.sessionStorage.getItem(PASSWORD_RESET_TOKEN_KEY) ?? "",
  };
}

export function storePasswordResetContext(
  nextContext: Partial<PasswordResetContext>,
) {
  if (!canUseStorage()) {
    return;
  }

  const current = readPasswordResetContext();
  const email = nextContext.email ?? current.email;
  const token = nextContext.token ?? current.token;

  if (email) {
    window.sessionStorage.setItem(PASSWORD_RESET_EMAIL_KEY, email);
  }

  if (token) {
    window.sessionStorage.setItem(PASSWORD_RESET_TOKEN_KEY, token);
  }
}

export function clearPasswordResetContext() {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(PASSWORD_RESET_EMAIL_KEY);
  window.sessionStorage.removeItem(PASSWORD_RESET_TOKEN_KEY);
}

export function clearPasswordResetToken() {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(PASSWORD_RESET_TOKEN_KEY);
}
