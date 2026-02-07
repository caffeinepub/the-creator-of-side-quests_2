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
- [ ] **Chrome**: Click Login button → II window opens → Complete authentication → Redirected back → Profile setup modal appears (if first time) → Login successful
- [ ] **Firefox**: Same flow as Chrome
- [ ] **Safari**: Same flow as Chrome
- [ ] **Opera/Opera GX**: Same flow as Chrome

#### Returning User Login
- [ ] **Chrome**: Click Login → II recognizes user → Auto-login → No profile setup modal → Dashboard accessible
- [ ] **Firefox**: Same flow as Chrome
- [ ] **Safari**: Same flow as Chrome
- [ ] **Opera/Opera GX**: Same flow as Chrome

#### Login Error Handling
- [ ] **Chrome**: Close II window without completing → Error toast appears → Login button remains clickable → Retry works
- [ ] **Firefox**: Same flow as Chrome
- [ ] **Safari**: Same flow as Chrome
- [ ] **Opera/Opera GX**: Same flow as Chrome

#### Logout
- [ ] **Chrome**: Click Logout → Confirmation → Session cleared → Redirected to public view → Login button visible
- [ ] **Firefox**: Same flow as Chrome
- [ ] **Safari**: Same flow as Chrome
- [ ] **Opera/Opera GX**: Same flow as Chrome

### 2. Navigation & Routing

#### Public Pages
- [ ] **Chrome**: All public pages load without errors (Home, About, Services, Shop, Portfolio, Testimonials, Contact, Hours & Policies)
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Admin Pages (After Login)
- [ ] **Chrome**: All admin routes accessible after verification (Dashboard, Products, Portfolio, Testimonials, Social Links, Contact Requests, Coupons, Loyalty Rewards, Giveaways, Policies & Fulfillment, Stripe Setup, Access, Verification Codes)
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Route Guards
- [ ] **Chrome**: Accessing /admin without login → Redirected to verification gate → Login required
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

### 3. Responsive Layout

#### Desktop (1920x1080)
- [ ] **Chrome**: Header, navigation, content, footer all visible and properly aligned
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Tablet (768x1024)
- [ ] **Chrome**: Layout adapts, mobile menu works, no horizontal scroll
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Mobile (375x667)
- [ ] **Chrome**: Mobile menu accessible, content readable, forms usable, no horizontal overflow
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

### 4. Admin Dashboard Mobile (Motorola G5/G5 Ace)

#### Viewport Sizes to Test
- Motorola G5: 360x640 (or similar small Android phone)
- Motorola G5 Ace: 412x915 (or similar mid-size Android phone)

#### Main Content Vertical Scrolling
- [ ] **Chrome (360x640)**: Visit /admin → Main content area scrolls vertically from top to bottom → No stuck scroll behavior
- [ ] **Chrome (412x915)**: Same as above
- [ ] **Firefox (360x640)**: Same as Chrome
- [ ] **Firefox (412x915)**: Same as Chrome
- [ ] **Safari iOS (similar size)**: Same as Chrome
- [ ] **Opera/Opera GX (360x640)**: Same as Chrome
- [ ] **Opera/Opera GX (412x915)**: Same as Chrome

#### Sidebar Navigation Independent Scrolling
- [ ] **Chrome (360x640)**: Visit /admin → Sidebar navigation scrolls independently → Can reach "Verification Codes" at bottom → No horizontal scroll triggered
- [ ] **Chrome (412x915)**: Same as above
- [ ] **Firefox (360x640)**: Same as Chrome
- [ ] **Firefox (412x915)**: Same as Chrome
- [ ] **Safari iOS (similar size)**: Same as Chrome
- [ ] **Opera/Opera GX (360x640)**: Same as Chrome
- [ ] **Opera/Opera GX (412x915)**: Same as Chrome

#### Admin Tables Mobile Responsiveness
- [ ] **Chrome (360x640)**: Visit /admin/products → Table displays without horizontal overflow → Essential columns visible → Long text wraps
- [ ] **Chrome (360x640)**: Visit /admin/portfolio → Table displays without horizontal overflow → Responsive column visibility
- [ ] **Chrome (360x640)**: Visit /admin/testimonials → Table displays without horizontal overflow → Content readable
- [ ] **Chrome (360x640)**: Visit /admin/giveaways → Tables display without horizontal overflow → Principal IDs wrap properly
- [ ] **Chrome (412x915)**: Repeat above for all admin tables
- [ ] **Firefox (360x640)**: Same as Chrome for all admin tables
- [ ] **Firefox (412x915)**: Same as Chrome for all admin tables
- [ ] **Safari iOS (similar size)**: Same as Chrome for all admin tables
- [ ] **Opera/Opera GX (360x640)**: Same as Chrome for all admin tables
- [ ] **Opera/Opera GX (412x915)**: Same as Chrome for all admin tables

#### Admin Layout No Clipping
- [ ] **Chrome (360x640)**: Visit all /admin/* routes → No content clipped → All interactive elements reachable → Proper spacing maintained
- [ ] **Chrome (412x915)**: Same as above
- [ ] **Firefox (360x640)**: Same as Chrome
- [ ] **Firefox (412x915)**: Same as Chrome
- [ ] **Safari iOS (similar size)**: Same as Chrome
- [ ] **Opera/Opera GX (360x640)**: Same as Chrome
- [ ] **Opera/Opera GX (412x915)**: Same as Chrome

### 5. Error Handling

#### Network Errors
- [ ] **Chrome**: Disconnect network → Attempt action → Error toast with user-friendly message → No sensitive data exposed
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Backend Errors
- [ ] **Chrome**: Trigger backend error (e.g., invalid input) → Generic error message shown → No stack traces or internal details exposed
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Session Expiry
- [ ] **Chrome**: Wait for session to expire → Attempt admin action → Redirected to verification gate → Can re-authenticate
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

### 6. Admin Verification Flow

#### Three-Step Verification
- [ ] **Chrome**: Enter Code #1 → Step 1 success → Enter Code #2 → Step 2 success → Enter Code #3 → Step 3 success → Welcome modal → Dashboard accessible
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Master Override
- [ ] **Chrome**: Enter Master Override Code → All steps bypassed → Welcome modal → Dashboard accessible
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Failed Attempts & Lockout
- [ ] **Chrome**: Enter wrong code 3 times → Permanent lockout modal appears → Cannot access admin → Lockout persists across sessions
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Remaining Attempts Display
- [ ] **Chrome**: Enter wrong code → Remaining attempts counter decreases → Displayed correctly on each step
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

### 7. Forms & Inputs

#### Contact Form
- [ ] **Chrome**: Fill all fields → Submit → Success message → Form cleared
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Product Creation (Admin)
- [ ] **Chrome**: Upload image → Fill fields → Submit → Product appears in list
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Testimonial Creation (Public)
- [ ] **Chrome**: Rate with stars → Write content → Submit → Success toast
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

### 8. Image & Media Handling

#### Image Upload
- [ ] **Chrome**: Select valid image → Upload progress shown → Image appears correctly
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Image Display
- [ ] **Chrome**: Product images, portfolio images, generated assets all load and display correctly
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Invalid File Handling
- [ ] **Chrome**: Attempt to upload invalid file type → Error message → Upload blocked
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

### 9. Performance & Loading States

#### Initial Page Load
- [ ] **Chrome**: Page loads within 3 seconds → No blank screens → Loading indicators shown where appropriate
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Data Fetching
- [ ] **Chrome**: Loading states shown during data fetch → Smooth transition to content → No flash of empty state
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Mutation Loading States
- [ ] **Chrome**: Button shows loading state during mutation → Disabled during operation → Re-enabled after completion
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

### 10. Accessibility

#### Keyboard Navigation
- [ ] **Chrome**: Tab through all interactive elements → Focus visible → Enter/Space activates buttons
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

#### Screen Reader (Optional)
- [ ] **Chrome + NVDA/JAWS**: Page structure announced → Form labels read → Error messages announced
- [ ] **Safari + VoiceOver**: Same as Chrome

#### Color Contrast
- [ ] **Chrome**: Text readable in both light and dark modes → Sufficient contrast ratios
- [ ] **Firefox**: Same as Chrome
- [ ] **Safari**: Same as Chrome
- [ ] **Opera/Opera GX**: Same as Chrome

## Notes
- Test on actual devices when possible, especially for mobile scenarios
- Use browser DevTools device emulation as a fallback
- Document any browser-specific issues discovered
- Verify fixes across all browsers before marking as resolved
