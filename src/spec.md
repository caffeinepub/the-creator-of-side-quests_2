# Specification

## Summary
**Goal:** Fix the Admin Dashboard experience on small Android phones (Motorola G5 / G5 Ace) by eliminating layout breakage and enabling reliable vertical scrolling in both the main content area and the left sidebar navigation.

**Planned changes:**
- Adjust admin page layout styles for narrow mobile viewports (~360–412px) to prevent cut-off content, horizontal overflow, and overlapping UI across all existing `/admin` and `/admin/*` routes while keeping current theme styling.
- Ensure the main Admin Dashboard content area is vertically scrollable on mobile (no fixed containers or overflow settings that block scrolling).
- Make the left admin sidebar/navigation independently vertically scrollable so all nav items (including bottom entries like “Verification Codes”) remain reachable on short screens.
- Update `frontend/QA-CHECKLIST.md` with a dedicated Admin Dashboard mobile section that includes explicit Motorola G5 / G5 Ace (or equivalent viewport) verification steps for: main content scrolling, sidebar independent scrolling, and reaching the bottom-most nav item.

**User-visible outcome:** On Motorola G5/G5 Ace-sized screens, admins can use every admin page without clipped/overlapping UI or horizontal scrolling, can scroll through page content top-to-bottom, and can scroll the sidebar to reach all navigation items.
