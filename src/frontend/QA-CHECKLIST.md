# Cross-Browser QA Checklist

This checklist covers the minimum manual verification steps for ensuring the application works correctly across major browsers.

## Target Browsers
- Chrome (latest stable)
- Firefox (latest stable)
- Safari (latest stable)
- Opera / Opera GX (latest stable)

## Test Scenarios

### 1. Login Flow (Internet Identity)

#### Clean Session Login
- [ ] **Chrome**: Click Login button → Internet Identity popup opens → Complete authentication → User is logged in
- [ ] **Firefox**: Click Login button → Internet Identity popup opens → Complete authentication → User is logged in
- [ ] **Safari**: Click Login button → Internet Identity popup opens → Complete authentication → User is logged in
- [ ] **Opera/Opera GX**: Click Login button → Internet Identity popup opens → Complete authentication → User is logged in

#### Popup Blocked Scenario
- [ ] **Chrome**: Block popups → Click Login → User sees clear error message about popup being blocked
- [ ] **Firefox**: Block popups → Click Login → User sees clear error message about popup being blocked
- [ ] **Safari**: Block popups → Click Login → User sees clear error message about popup being blocked
- [ ] **Opera/Opera GX**: Block popups → Click Login → User sees clear error message about popup being blocked

#### Login Button State Recovery
- [ ] **All browsers**: If login fails or times out, the Login button returns to an actionable state (not stuck on "Logging in...")
- [ ] **All browsers**: User can retry login after a failure without refreshing the page

### 2. Logout Recovery
- [ ] **Chrome**: Click Logout → User is logged out → App remains functional → Can navigate to public pages
- [ ] **Firefox**: Click Logout → User is logged out → App remains functional → Can navigate to public pages
- [ ] **Safari**: Click Logout → User is logged out → App remains functional → Can navigate to public pages
- [ ] **Opera/Opera GX**: Click Logout → User is logged out → App remains functional → Can navigate to public pages

### 3. Basic Navigation (Public Routes)

#### Shop Page
- [ ] **All browsers**: Navigate to /shop → Page loads without errors → Products display correctly

#### Contact Page
- [ ] **All browsers**: Navigate to /contact → Page loads → Form is usable → Can submit contact request

#### Testimonials Page
- [ ] **All browsers**: Navigate to /testimonials → Page loads → Testimonials display → Create Testimony button works

#### Portfolio Page
- [ ] **All browsers**: Navigate to /portfolio → Page loads → Portfolio items display → Lightbox opens on click

### 4. Admin Guard Screens

#### Authentication Required Screen
- [ ] **All browsers**: Navigate to /admin while logged out → Shows "Authentication Required" message → "Return Home" button works

#### Admin Verification Screen
- [ ] **All browsers**: Navigate to /admin while logged in (but not verified) → Shows three-step verification form → Form is usable

#### Lockout Screen
- [ ] **All browsers**: If user is permanently locked out → Shows "Admin Access Permanently Locked" message → User can still access non-admin pages

### 5. Responsive Layout (Mobile/Tablet/Desktop)

#### Header Navigation
- [ ] **Mobile (360px-767px)**: Hamburger menu opens/closes reliably → Links are tappable → No horizontal overflow
- [ ] **Tablet (768px-1023px)**: Navigation displays correctly → All links accessible
- [ ] **Desktop (1024px+)**: Full navigation bar displays → All links accessible

#### Forms
- [ ] **Mobile**: Contact form is readable and usable → Inputs don't overflow → Submit button works
- [ ] **Mobile**: Testimonial dialog is readable and usable → Form fits on screen
- [ ] **Tablet**: All forms remain usable and readable

#### Dialogs/Modals
- [ ] **Mobile**: Portfolio lightbox displays correctly → Content scrolls if needed → No content clipped off-screen
- [ ] **Mobile**: Testimonial creation dialog displays correctly → Content scrolls if needed
- [ ] **Mobile**: Admin lockout modal displays correctly

### 6. Error Handling

#### Network Issues
- [ ] **All browsers**: Simulate network failure during login → User sees clear error message → App remains usable

#### Missing URL Parameters
- [ ] **All browsers**: Load app without admin token parameter → App loads normally → Public pages work → Admin pages show appropriate guard screens

## Notes
- Test with browser developer tools open to catch console errors
- Verify no sensitive data (tokens, secrets) is logged to console
- Check that no unhandled promise rejections occur
- Ensure all error messages are in clear English
- Verify that the app never shows a blank screen (always shows some UI)

## Reporting Issues
When reporting a browser-specific issue, include:
1. Browser name and version
2. Operating system
3. Steps to reproduce
4. Expected behavior
5. Actual behavior
6. Console errors (if any)
