interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  ux_mode?: "popup" | "redirect";
}

interface GoogleRenderButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  width?: number;
  locale?: string;
  logo_alignment?: "left" | "center";
}

interface GoogleAccountsIdApi {
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (parent: HTMLElement, options: GoogleRenderButtonOptions) => void;
}

interface GoogleIdentityApi {
  accounts: {
    id: GoogleAccountsIdApi;
  };
}

interface Window {
  google?: GoogleIdentityApi;
}
