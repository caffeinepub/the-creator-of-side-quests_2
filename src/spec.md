# Specification

## Summary
**Goal:** Replace the old single shared-code admin gate with a sequential three-step admin verification flow, enforced by both UI and backend authorization.

**Planned changes:**
- Implement a new step-by-step Admin verification screen to replace the existing single-code gate UI, showing one code input at a time with “Step 1 of 3 / Step 2 of 3 / Step 3 of 3” progress and English-only messaging.
- Update admin route protection and related frontend hooks/utilities to track multi-step verification state (including partial progress), only authorizing access after all three steps complete, and clearing progress on logout.
- Update backend admin verification APIs and authorization checks to validate step order server-side, expose endpoints to check verification status and submit the current step code, and retire the old single-code verification/session behavior.
- Ensure the three codes are treated as secrets: do not embed plaintext codes in the frontend bundle, do not log codes, and return generic English errors that do not leak expected or submitted codes.

**User-visible outcome:** Signed-in users who click or navigate to Admin are guided through a 3-step verification flow and only see the Admin Dashboard after completing all steps in order; unauthorized users remain blocked from admin routes and admin-only backend actions.
