# Specification

## Summary
**Goal:** Replace the current admin authentication with a server-side three-step verification (Code #1 → Code #2 → Code #3) and a new Master Override Code for admin code rotation, while keeping all admin routes and admin-only actions fully protected.

**Planned changes:**
- Update backend admin verification to require completing Code #1, then Code #2, then Code #3 in exact order to obtain an admin session, and accept only the newly provided Master Override Code for master-override verification and code rotation.
- Treat all codes as secrets end-to-end: ensure no plaintext codes are embedded in the frontend bundle, returned in responses, or logged; store/validate server-side in a rotation-suitable way (non-plaintext stable representation).
- Preserve protection of all `/admin` routes and admin-only backend mutations behind the admin verification session; keep non-admin/public features unchanged.
- Add upgrade-safe migration/initialization so existing deployments switch to the new codes without needing old codes, invalidate in-progress admin verification sessions, and preserve any permanent lockout state.
- Update frontend admin verification UX copy to reflect 3 ordered steps (Step 1/3, 2/3, 3/3) and Master Override Code usage for code rotation, without referencing any retired authentication mechanism.

**User-visible outcome:** Admin users see an ordered 3-step verification gate before accessing any admin pages, and the verification code management flow requires the Master Override Code to rotate codes; admin content remains inaccessible without a valid verified admin session.
