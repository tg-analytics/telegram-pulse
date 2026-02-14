const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleScriptPromise: Promise<void> | null = null;

function hasGoogleIdentityApi() {
  return typeof window !== "undefined" && !!window.google?.accounts?.id;
}

export function loadGoogleIdentityScript(): Promise<void> {
  if (hasGoogleIdentityApi()) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document is unavailable."));
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`,
    );
    const script = existingScript ?? document.createElement("script");

    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    const onLoad = () => {
      cleanup();
      if (hasGoogleIdentityApi()) {
        resolve();
        return;
      }

      googleScriptPromise = null;
      reject(new Error("Google Identity Services loaded but API is unavailable."));
    };

    const onError = () => {
      cleanup();
      googleScriptPromise = null;
      reject(new Error("Failed to load Google Identity Services."));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    if (!existingScript) {
      script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return googleScriptPromise;
}
