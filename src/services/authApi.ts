import { API_BASE } from "@/config/api";

export interface GoogleSigninRequest {
  id_token: string;
  account_id: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  is_guest: boolean;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_at: string;
  account_id: string;
  user: AuthUser;
}

export type GoogleSigninResponse = AuthSession;

async function parseErrorMessage(response: Response) {
  const fallback = `Google sign-in failed (${response.status}).`;

  try {
    const payload = await response.json();
    if (typeof payload === "string" && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      const message =
        (typeof payload.message === "string" && payload.message) ||
        (typeof payload.error === "string" && payload.error) ||
        (typeof payload.detail === "string" && payload.detail);

      if (message) {
        return message;
      }
    }
  } catch {
    // Ignore JSON parse errors and use fallback below.
  }

  return fallback;
}

export async function signinWithGoogle(payload: GoogleSigninRequest): Promise<GoogleSigninResponse> {
  const response = await fetch(`${API_BASE}/v1.0/signin/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
}
