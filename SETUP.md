# LuxEvents.app — Setup & Deployment Guide

## What's been built

A full-stack event vendor marketplace with:
- ✅ Landing page with hero, categories, featured vendors
- ✅ Provider directory with filters (category, city, sort)
- ✅ Individual vendor profile pages with gallery, reviews, services
- ✅ Client signup/login (email + password via Supabase Auth)
- ✅ Vendor signup/login with role selector
- ✅ Vendor dashboard (overview, profile editor, photo upload, bookings, subscription)
- ✅ Booking flow with Stripe payment
- ✅ Subscription plans (Basic $49, Professional $99, Premium $199/month)
- ✅ 10% platform commission on all bookings
- ✅ Stripe webhooks for subscription + payment lifecycle
- ✅ Reviews with provider responses
- ✅ Supabase Storage for photo uploads
- ✅ Row-level security on all tables

---

## STEP 1 — Supabase: Run the schema

1. Go to https://supabase.com → your project → SQL Editor
2. Open `supabase/schema.sql` from this project
3. Run the entire file
4. Then create storage buckets:
   - Go to Storage → New Bucket → name: `provider-media`, toggle Public: ON
   - New Bucket → name: `avatars`, toggle Public: ON

---

## STEP 2 — Stripe: Create products and prices

1. Go to https://dashboard.stripe.com → Products
2. Create 3 products:

   **Basic** — $49/month (recurring)
   → Copy the Price ID (starts with `price_`)

   **Professional** — $99/month (recurring)
   → Copy the Price ID

   **Premium** — $199/month (recurring)
   → Copy the Price ID

3. Go to Stripe → Developers → API Keys → copy Secret Key and Publishable Key

4. Set up webhook:
   - Stripe → Developers → Webhooks → Add endpoint
   - URL: `https://www.luxevents.app/api/stripe/webhook`
   - Events to listen to:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the Webhook Signing Secret (starts with `whsec_`)

---

## STEP 3 — Fill in .env.local

Edit `.env.local` and replace all `REPLACE_ME` placeholders:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
```

---

## STEP 4 — Push to GitHub and connect Vercel

```bash
# In this project folder:
git init
git add .
git commit -m "Initial LuxEvents build"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/luxevents.git
git push -u origin main
```

Then in Vercel:
1. Import the GitHub repo
2. Framework: Next.js (auto-detected)
3. Add all environment variables from `.env.local`
4. Deploy

---

## STEP 5 — Test locally first

```bash
npm install
npm run dev
```

Visit http://localhost:3000

Test the full flow:
1. Sign up as a vendor
2. Fill in profile (Dashboard → My Profile)
3. Upload photos (Dashboard → Photos & Media)
4. Subscribe (Dashboard → Subscription) — use Stripe test card `4242 4242 4242 4242`
5. Sign up as a client in a different browser
6. Browse vendors → view profile → Book
7. Complete payment with test card

---

## Revenue model summary

| Revenue Stream      | Amount       |
|---------------------|--------------|
| Basic subscription  | $49/month    |
| Pro subscription    | $99/month    |
| Premium subscription| $199/month   |
| Booking commission  | 10% per sale |
| Premium commission  | 7% per sale  |

---

## Next features to add (roadmap)

- [ ] Messaging system between clients and vendors
- [ ] Calendar availability blocking
- [ ] Email notifications (Resend or SendGrid)
- [ ] Admin panel for approving vendors
- [ ] Vendor analytics (profile views, conversion)
- [ ] Review request emails after event date
- [ ] Google/social OAuth login
- [ ] SEO-optimized city pages (/dallas/photographers)
- [ ] Blog/tips section for vendor content

---

## Tech stack

| Layer      | Tech                     |
|------------|--------------------------|
| Frontend   | Next.js 15, React 18     |
| Styling    | Tailwind CSS             |
| Database   | Supabase (PostgreSQL)    |
| Auth       | Supabase Auth            |
| Storage    | Supabase Storage         |
| Payments   | Stripe                   |
| Deploy     | Vercel                   |
