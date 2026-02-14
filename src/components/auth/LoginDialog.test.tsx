import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";

const loadGoogleIdentityScriptMock = vi.fn();
const signinWithGoogleMock = vi.fn();

vi.mock("@/config/auth", () => ({
  GOOGLE_CLIENT_ID: "google-client-id",
}));

vi.mock("@/lib/googleIdentity", () => ({
  loadGoogleIdentityScript: (...args: unknown[]) => loadGoogleIdentityScriptMock(...args),
}));

vi.mock("@/services/authApi", () => ({
  signinWithGoogle: (...args: unknown[]) => signinWithGoogleMock(...args),
}));

function OpenDialogOnMount() {
  const { setShowLoginDialog } = useAuth();

  useEffect(() => {
    setShowLoginDialog(true);
  }, [setShowLoginDialog]);

  return <LoginDialog />;
}

function renderLoginDialog() {
  return render(
    <AuthProvider>
      <OpenDialogOnMount />
    </AuthProvider>,
  );
}

describe("LoginDialog", () => {
  let googleCallback: ((response: { credential?: string }) => void) | null = null;
  let initializeMock: ReturnType<typeof vi.fn>;
  let renderButtonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    loadGoogleIdentityScriptMock.mockReset();
    signinWithGoogleMock.mockReset();
    loadGoogleIdentityScriptMock.mockResolvedValue(undefined);

    googleCallback = null;
    initializeMock = vi.fn((config: { callback: (response: { credential?: string }) => void }) => {
      googleCallback = config.callback;
    });
    renderButtonMock = vi.fn();

    (window as Window & { google: unknown }).google = {
      accounts: {
        id: {
          initialize: initializeMock,
          renderButton: renderButtonMock,
        },
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as Window & { google?: unknown }).google;
  });

  it("loads GIS and renders official Google button when dialog opens", async () => {
    renderLoginDialog();

    await waitFor(() => expect(loadGoogleIdentityScriptMock).toHaveBeenCalledTimes(1));
    expect(initializeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: "google-client-id",
        callback: expect.any(Function),
      }),
    );
    expect(renderButtonMock).toHaveBeenCalledTimes(1);
  });

  it("exchanges id token and persists session on successful Google sign-in", async () => {
    signinWithGoogleMock.mockResolvedValue({
      access_token: "jwt-token",
      token_type: "bearer",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      account_id: "11111111-1111-1111-1111-111111111111",
      user: {
        id: "af2a103b-1e52-457a-af33-c5b2f9c4e2e3",
        email: "microsaas.farm@gmail.com",
        name: "microsaas.farm",
        role: "USER",
        status: "ACTIVE",
        is_guest: false,
      },
    });

    renderLoginDialog();

    await waitFor(() => expect(googleCallback).toBeTypeOf("function"));
    await act(async () => {
      googleCallback?.({ credential: "google-id-token" });
    });

    await waitFor(() =>
      expect(signinWithGoogleMock).toHaveBeenCalledWith({
        id_token: "google-id-token",
      }),
    );
    await waitFor(() => expect(localStorage.getItem("auth-session")).not.toBeNull());
    await waitFor(() => expect(screen.queryByText("Welcome to Telemetrio")).not.toBeInTheDocument());
  });

  it("shows inline error and does not login when backend sign-in fails", async () => {
    signinWithGoogleMock.mockRejectedValue(new Error("Backend denied Google token"));

    renderLoginDialog();

    await waitFor(() => expect(googleCallback).toBeTypeOf("function"));
    await act(async () => {
      googleCallback?.({ credential: "bad-token" });
    });

    await waitFor(() =>
      expect(signinWithGoogleMock).toHaveBeenCalledWith({
        id_token: "bad-token",
      }),
    );
    expect(await screen.findByText("Backend denied Google token")).toBeInTheDocument();
    expect(localStorage.getItem("auth-session")).toBeNull();
  });

  it("keeps mocked magic-link behavior", async () => {
    renderLoginDialog();

    const input = await screen.findByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "user@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send magic link/i }));

    await waitFor(() => expect(localStorage.getItem("auth-logged-in")).toBe("true"), {
      timeout: 2500,
    });
  });
});
