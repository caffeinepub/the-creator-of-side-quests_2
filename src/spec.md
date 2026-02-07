# Specification

## Summary
**Goal:** Add a shared-code verification step for all admin access (frontend + backend) and provide an admin-only page to grant/revoke admin permissions for other accounts.

**Planned changes:**
- Add a shared-code gate on all `/admin` and `/admin/*` routes that requires a signed-in admin to enter the code `A7F9K2M8Q4R6T1Z5X3LJH9C8` before the admin layout/pages render.
- Persist shared-code verification for the current browser session and clear it on sign-out; show clear English errors for incorrect codes.
- Add backend APIs to verify the shared code and create an expiring admin-session marker, plus enforce that marker on all admin-only backend operations (in addition to existing admin permission checks).
- Add basic brute-force protection for shared-code verification (per-caller attempt counting and temporary lockout with clear failure responses).
- Create an Admin “Access” page within `/admin` to grant/revoke admin access for other accounts via backend admin-only APIs, with English success/error feedback.

**User-visible outcome:** Signed-in admins must enter the shared code once per session to access any admin page; verified admins can manage (grant/revoke) admin access for other users from a dedicated Admin Access page.
