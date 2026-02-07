const ADMIN_VERIFICATION_PROGRESS_KEY = 'admin_verification_progress';

export type AdminVerificationProgress = 0 | 1 | 2 | 3;

export function setAdminVerificationProgress(step: AdminVerificationProgress): void {
  sessionStorage.setItem(ADMIN_VERIFICATION_PROGRESS_KEY, step.toString());
}

export function getAdminVerificationProgress(): AdminVerificationProgress {
  const stored = sessionStorage.getItem(ADMIN_VERIFICATION_PROGRESS_KEY);
  if (!stored) return 0;
  const parsed = parseInt(stored, 10);
  if (parsed >= 0 && parsed <= 3) return parsed as AdminVerificationProgress;
  return 0;
}

export function isFullyVerified(): boolean {
  return getAdminVerificationProgress() === 3;
}

export function clearAdminVerificationProgress(): void {
  sessionStorage.removeItem(ADMIN_VERIFICATION_PROGRESS_KEY);
}

// Legacy exports for backward compatibility during migration
export function setAdminCodeVerified(): void {
  setAdminVerificationProgress(3);
}

export function isAdminCodeVerified(): boolean {
  return isFullyVerified();
}

export function clearAdminCodeVerified(): void {
  clearAdminVerificationProgress();
}
