# Specification

## Summary
**Goal:** Make the Internet Identity login flow reliable across major browsers and ensure the site remains responsive and usable across common device sizes, with clear error handling and lightweight regression coverage.

**Planned changes:**
- Improve the Login button’s Internet Identity popup/session handling to work reliably on Chrome, Firefox, Safari, and Opera/Opera GX, including clear user-facing error messages when popup/session establishment fails.
- Ensure the login UI never stays stuck in a “Logging in...” state by adding recovery/timeout paths that return the UI to an actionable state (e.g., retry).
- Harden actor/access-control initialization so missing/blocked/cleared URL parameters or session differences do not crash the app; handle failures gracefully and keep public pages usable.
- Ensure logout reliably clears session state without breaking subsequent usage across target browsers.
- Audit and adjust responsive UI behavior across key pages and flows (header navigation + mobile hamburger menu, forms, dialogs/modals, Shop/Contact/Testimonials/Admin guard screens) to prevent overflow and improve usability on phones/tablets/desktops.
- Add an in-repo cross-browser QA checklist (manual steps) for Chrome, Firefox, Safari, and Opera/Opera GX covering login and critical navigation.
- Add at least one automated smoke check (supported by existing project tooling) to verify basic render/navigation and that invoking Login does not hard-crash the UI.

**User-visible outcome:** Users can click “Login” and complete Internet Identity authentication across major browsers; if login can’t start or fails, they see a clear English error and can retry. The site remains usable (including on mobile/tablet), navigation and dialogs work without layout breakage, and there’s basic QA/smoke coverage to reduce regressions.
