import { getTranslations } from "@/app/i18n";

type AuthLabels = ReturnType<typeof getTranslations>["auth"];

export function getAuthErrorMessage(labels: AuthLabels, code: string) {
  switch (code) {
    case "invalid_credentials":
      return labels.invalidCredentials;
    case "account_not_found":
      return labels.accountNotFound;
    case "too_many_attempts":
      return labels.tooManyAttempts;
    case "invalid_email":
      return labels.invalidEmail;
    case "full_name_required":
      return labels.fullNameRequired;
    case "invalid_phone":
      return labels.invalidSaudiPhone;
    case "password_too_short":
      return labels.passwordMinLength;
    case "passwords_do_not_match":
      return labels.passwordsDoNotMatch;
    case "invalid_reset_link":
      return labels.invalidResetLink;
    case "current_password_invalid":
      return labels.currentPasswordInvalid;
    default:
      return labels.unableToSignIn;
  }
}

export function getPasswordRecoveryErrorMessage(labels: AuthLabels, code: string) {
  if (code === "invalid_email") return labels.invalidEmail;
  if (code === "invalid_reset_link") return labels.invalidResetLink;
  if (code === "recovery_rate_limited") return labels.resetLinkRateLimited;
  return labels.resetLinkSendFailed;
}
