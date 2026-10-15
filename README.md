# Cravers Joy Cakes - Full-Stack Admin Panel

A modern, mobile-responsive website for Cravers Joy Cakes with a complete admin panel for managing cakes, categories, banners, carousel, and more.

## Features

### Public Website
- **Mobile-responsive design** - Works perfectly on all devices
- **Dynamic content** - All content loaded from Supabase database
- **Homepage carousel** - Admin-controlled hero slides
- **Product catalog** - Browse cakes by category
- **Order system** - Instant price estimates with WhatsApp integration
- **Offer banners** - Promotional banners with discounts

### Admin Panel
- **Secure authentication** - Email/password signup, login, and password reset
- **Dashboard** - Overview of all content
- **Cake management** - Add, edit, delete cakes with images and pricing
- **Category management** - Organize cakes into categories
- **Carousel control** - Manage homepage slider images
- **Banner system** - Create promotional banners with:
  - Discount percentages
  - Custom price lists (JSON format)
  - Start/end dates for time-limited offers
- **Testimonials** - Manage customer reviews
- **Settings** - Configure delivery areas and cake flavors

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **Hosting**: Vercel (recommended)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose a name (e.g., "cravers-joy-cakes")
4. Set a strong database password
5. Choose a region close to Kenya (e.g., South Africa)
6. Wait for the project to be created (2-3 minutes)

### 3. Set Up Database

1. In your Supabase project, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click **Run**
4. This will create all necessary tables and policies

### 4. Set Up Storage

1. In Supabase, go to **Storage**
2. Create a new bucket named `cake-images`
3. Make it **Public** (click the bucket, then "Make public")
4. Create folders inside the bucket:
   - `cakes`
   - `carousel`
   - `banners`
   - `categories`

### 5. Get Supabase Credentials

1. In Supabase, go to **Project Settings** → **API**
2. Copy the **Project URL**
3. Copy the **anon public key**
4. Keep these safe - you'll need them for the next step

### 6. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### 7. Install Dependencies

```bash
cd cravers-joy-admin
npm install
```

### 8. Run Development Server

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

### 9. Create Admin Account

1. Go to `http://localhost:3000/admin/signup`
2. Enter your email and password
3. Click "Create Account"
4. Check your email for a confirmation link (from Supabase)
5. After confirming, log in at `http://localhost:3000/admin/login`

### 10. Add Initial Content

After logging in, use the admin panel to add:
- Categories (Birthday, Wedding, Kids, etc.)
- Cakes with images
- Carousel slides
- Delivery areas
- Cake flavors

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cravers-joy-admin.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click "Deploy"
6. Wait for deployment to complete

### 3. Configure Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `craversjoycakes.com`)
3. Follow the DNS instructions

## Using the Admin Panel

### Adding a Cake

1. Go to `/admin/cakes`
2. Click "Add New Cake"
3. Fill in the details:
   - Name (required)
   - Category
   - Upload image
   - Tag (short description)
   - Description
   - Price type (kg, each, from, tier, or by flavor)
   - Base price
   - Minimum quantity
   - Notice days (how much advance notice needed)
   - Emoji (for display)
   - Unit label (e.g., "Dozens", "Boxes")
4. Click "Create Cake"

### Creating an Offer Banner

1. Go to `/admin/banners`
2. Click "Create Banner"
3. Fill in banner details
4. Check "This is an offer banner" to enable offer features:
   - Set discount percentage (e.g., 20 for 20% off)
   - Set start and end dates
   - Optionally add custom price list in JSON format:
     ```json
     [
       {"name": "Vanilla Cake", "original_price": 3000, "offer_price": 2400},
       {"name": "Chocolate Cake", "original_price": 3200, "offer_price": 2560}
     ]
     ```
5. Click "Create Banner"

### Managing Carousel

1. Go to `/admin/carousel`
2. Add slides with:
   - Title (headline)
   - Subtitle
   - Price text (e.g., "from KSh 3,000")
   - Image
   - Emoji
   - Category link (to link to a category)
   - Order index (to control slide order)
3. Activate/deactivate slides as needed

## File Structure

```
cravers-joy-admin/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin panel pages
│   │   │   ├── login/       # Admin login
│   │   │   ├── signup/      # Admin signup
│   │   │   ├── dashboard/   # Admin dashboard
│   │   │   ├── cakes/       # Cake management
│   │   │   ├── categories/  # Category management
│   │   │   ├── carousel/    # Carousel management
│   │   │   ├── banners/     # Banner management
│   │   │   ├── testimonials/# Testimonial management
│   │   │   └── settings/    # Settings (delivery areas, flavors)
│   │   ├── page.tsx         # Homepage
│   │   ├── shop/            # Shop page
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   └── order/           # Order page
│   ├── components/
│   │   └── AdminNav.tsx     # Admin navigation
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   └── supabase-server.ts # Server-side Supabase client
│   ├── types/
│   │   └── database.ts      # TypeScript types
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   └── middleware.ts        # Auth middleware
├── supabase-schema.sql      # Database schema
├── SETUP.md                 # Detailed setup guide
└── package.json
```

## Troubleshooting

### Images not uploading
- Ensure the `cake-images` bucket is public
- Check that the folder structure exists in Storage
- Verify your Supabase credentials are correct

### Admin panel redirects to login
- Check that you're logged in (check browser cookies)
- Verify the middleware is working correctly
- Ensure Supabase Auth is enabled in your project

### Content not showing on website
- Check that items are marked as "active" in the admin panel
- Verify the database connection is working
- Check browser console for errors

### Mobile layout issues
- The site uses Tailwind's responsive classes
- Test on different screen sizes
- All pages are designed to be mobile-first

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs
- Check Tailwind CSS documentation: https://tailwindcss.com/docs

## License

This project is for Cravers Joy Cakes.
