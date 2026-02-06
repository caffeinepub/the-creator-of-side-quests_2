# Specification

## Summary
**Goal:** Replace placeholder admin pages with functional management UIs (products, testimonials, giveaways, portfolio) and add a public testimonial creation flow with mossy-green glowing star ratings.

**Planned changes:**
- Implement a full Admin Products UI at `/admin/products` to list/create/edit/delete products (name, description, price, optional category, in-stock toggle, requires-quote toggle, image upload) using existing backend product APIs and existing admin route protection.
- Add a public Testimonials page “Create Testimony” flow for signed-in users, including author/content inputs, validation, and a 1–5 rating control styled as mossy-green glowing stars; ensure displayed testimonial ratings use the same styling.
- Implement an Admin Testimonials UI at `/admin/testimonials` to list/create/edit/delete testimonials (including rating) using existing backend testimonial APIs, with accessible mossy-green glowing star rating controls.
- Implement an Admin Giveaways UI at `/admin/giveaways` featuring active giveaway selection, entrants list, admin entrant add flow, a spin/wheel animation to pick a winner, and winner history display, using existing backend giveaway APIs and handling empty/error states.
- Implement an Admin Portfolio UI at `/admin/portfolio` to upload/list/edit/delete portfolio items (media upload with progress/error handling, title/description/optional category), including a category option/value for “What I have created for the community,” using existing backend portfolio and blob-storage APIs.

**User-visible outcome:** Admins can manage products, testimonials, giveaways (including spinning to pick winners), and portfolio items from their admin pages instead of placeholders; signed-in users can create testimonials with mossy-green glowing star ratings and see the same star styling across testimonial displays.
