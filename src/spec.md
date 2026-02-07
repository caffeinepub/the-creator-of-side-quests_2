# Specification

## Summary
**Goal:** Finalize Phase 1 public Portfolio flip-card interactions for photos/videos, ensure hover behavior works reliably across browsers, and prevent memory leaks from unreleased media object URLs.

**Planned changes:**
- Fix flip-card event handling to prevent double-toggles from overlapping click/keyboard handlers between the flip-card and the Portfolio grid.
- Implement precise interaction rules for photos vs videos (click/Enter/Space flip exactly once; video click pauses then flips to description; second click flips back; “View Full” opens lightbox without changing flip state).
- Make video hover autoplay/pause behavior resilient to autoplay policy differences and ensure hover never starts playback while a card is flipped to the back.
- Revoke object URLs created for Portfolio thumbnails and lightbox media when no longer in use to avoid memory growth during repeated navigation.

**User-visible outcome:** On the public Portfolio page, photo and video cards flip predictably (once per interaction), video hover behavior is stable even when autoplay is blocked, “View Full” opens the lightbox without unintended flipping, and repeated browsing does not cause accumulating memory usage.
