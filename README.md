# LeamTickets

A student-to-student ticket resale marketplace for Smack and Neon in Leamington Spa, built for University of Warwick students.

> **Disclaimer:** LeamTickets is not affiliated with Smack, Neon, or the University of Warwick.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5 (credentials)
- **Payments:** Stripe + Stripe Connect
- **Image uploads:** UploadThing (or Cloudinary/S3)
- **Email:** Nodemailer (SMTP)
- **Deployment:** Vercel

## Features

- Browse available tickets with filtering (venue, date) and sorting (price)
- Seller accounts (email + password)
- Create ticket listings with image upload and automatic 30/70 fee split
- Seller dashboard with Stripe Connect onboarding
- Stripe Checkout for secure card payments
- Automated email notifications (sold + purchase confirmation)
- Mobile-first responsive design

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in all values in `.env`. You'll need:
- A PostgreSQL database (free options: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
- A [Stripe](https://stripe.com) account (test mode keys are fine for development)
- An [UploadThing](https://uploadthing.com) account for image uploads
- SMTP credentials for emails (Gmail App Password works fine)

### 3. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Set up Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook secret and add it to `.env` as `STRIPE_WEBHOOK_SECRET`.

## Project Structure

```
app/
├── page.tsx                  # Homepage – ticket grid with filters
├── auth/
│   ├── login/page.tsx        # Login page
│   └── register/page.tsx     # Register page
├── sell/page.tsx             # Create ticket listing
├── dashboard/page.tsx        # Seller dashboard
├── tickets/[id]/
│   ├── page.tsx              # Ticket detail + buy button
│   └── success/page.tsx      # Post-purchase success
└── api/
    ├── auth/                 # NextAuth handlers + register
    ├── tickets/              # CRUD for tickets
    ├── stripe/
    │   ├── checkout/         # Create Stripe checkout session
    │   ├── connect/          # Stripe Connect onboarding
    │   └── webhook/          # Stripe webhook handler
    └── upload/               # Image upload endpoint

components/
├── navbar.tsx
├── footer.tsx
├── ticket-card.tsx
├── ticket-filters.tsx
└── ui/
    ├── button.tsx
    ├── input.tsx
    └── badge.tsx

lib/
├── prisma.ts
├── stripe.ts
├── email.ts
├── utils.ts
└── validations.ts
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Set up a Stripe webhook pointing to `https://yourdomain.com/api/stripe/webhook`

## Roadmap

- [ ] University email verification (@warwick.ac.uk)
- [ ] Buyer–seller messaging
- [ ] Seller ratings & reviews
- [ ] Admin dashboard
- [ ] QR code verification
- [ ] Dispute handling
- [ ] Push notifications
