const ADMIN_CODE_SESSION_KEY = 'admin_shared_code_verified';

export function setAdminCodeVerified(): void {
  sessionStorage.setItem(ADMIN_CODE_SESSION_KEY, 'true');
}

export function isAdminCodeVerified(): boolean {
  return sessionStorage.getItem(ADMIN_CODE_SESSION_KEY) === 'true';
}

export function clearAdminCodeVerified(): void {
  sessionStorage.removeItem(ADMIN_CODE_SESSION_KEY);
}
