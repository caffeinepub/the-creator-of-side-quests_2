# Specification

## Summary
**Goal:** Build a responsive multi-page marketing site for “The Creator of Side Quests” with a medieval-fantasy premium theme, admin-managed content (shop, portfolio, testimonials, policies, social links), and commerce/engagement features including Stripe checkout, quote requests, coupons, loyalty points, and a giveaway wheel.

**Planned changes:**
- Create public routes/pages: Home, About, Services, Shop, Portfolio, Testimonials, Contact, Hours & Policies with the specified copy, CTAs, quotes, and responsive layout.
- Apply cohesive deep mossy green/dark visual theme with serif + sans-serif typography, textured backgrounds, subtle motion, and at least one flippable card section (respect reduced motion).
- Add SEO-friendly structure: per-route titles/meta descriptions, semantic headings (single H1 per page), accessible labels, crawlable navigation.
- Add configurable social icon links (Instagram, Facebook, TikTok, YouTube) stored in backend and editable via Admin.
- Implement Internet Identity sign-in, with admin-only access gated by an allowlisted admin principal stored in backend settings.
- Build Admin panel to manage: portfolio items (with image upload), testimonials, shop products (pricing, images, stock toggles, fulfillment toggles), site policies/defaults.
- Implement Shop browsing and product details, with per-product Stripe checkout and/or “Request quote / Contact to purchase” flow; record checkout attempts/orders in backend.
- Implement persisted Contact/Quote requests (from Contact page and quote-only products) for admin review.
- Add coupon system (admin CRUD, validity/usage limits) and allow applying coupons during checkout with server-side validation.
- Add loyalty points system with points awarded for sign-in/sign-up, visit (rate-limited), share clicks, and completed purchases; admin-configured rules and reward thresholds; record reward issuance.
- Add giveaway system: admin creates events, entrants added for active giveaway (configurable), admin wheel UI to spin/select winner, persist winner history, prevent duplicate entries by default.
- Implement backend media storage and stable serving URLs for uploaded product/portfolio images with basic limits and clear errors.
- Add Ashland/Westwood KY “no shipping by default” messaging across Shop and relevant pages; ensure fulfillment toggles and UI reflect configured availability.
- Add static asset pipeline for generated brand imagery under `frontend/public/assets/generated` and use for header/favicon/hero/backgrounds without backend routing.

**User-visible outcome:** Visitors can browse a themed multi-page brand site, view services/portfolio/testimonials, shop products (pay via Stripe where enabled or request a quote), submit contact/quote requests, and sign in for loyalty points and giveaways; the creator can sign in as the single admin to manage site content, shop inventory/fulfillment, social links, coupons, points rules, and giveaway winners.
