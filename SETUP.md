# Cravers Joy Cakes - Admin Panel Setup Guide

This guide will help you set up the complete admin panel for Cravers Joy Cakes.

## Quick Start

If you want to get started quickly, follow these steps:

1. **Create Supabase Project** (5 minutes)
2. **Run Database Schema** (2 minutes)
3. **Set Up Storage** (2 minutes)
4. **Configure Environment Variables** (1 minute)
5. **Install and Run** (3 minutes)

Total time: ~15 minutes

---

## Detailed Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up (free)
2. Click **"New Project"**
3. Fill in the form:
   - **Name**: `cravers-joy-cakes`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose "South Africa" (closest to Kenya)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be ready

### Step 2: Set Up the Database

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of the `supabase-schema.sql` file from this project
4. Paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" when complete

This creates all the tables needed for:
- Categories
- Cakes
- Carousel slides
- Banners (with offer support)
- Testimonials
- Delivery areas
- Cake flavors

### Step 3: Set Up Storage for Images

1. In Supabase, click **Storage** in the left sidebar
2. Click **"Create a new bucket"**
3. Name it: `cake-images`
4. Uncheck "Public bucket" temporarily
5. Click **"Create bucket"**
6. Click on the bucket you just created
7. Click the **pencil icon** next to "Public bucket" to edit
8. Check the box to make it **Public**
9. Click **"Save"**

Now create folders inside the bucket:
1. Click **"Create folder"**
2. Name it: `cakes`
3. Repeat for: `carousel`, `banners`, `categories`

### Step 4: Get Your Supabase Credentials

1. In Supabase, click **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy the **Project URL** (starts with https://)
4. Copy the **anon public key** (long string)

Keep these safe - you'll need them in the next step.

### Step 5: Configure Environment Variables

Create a file named `.env.local` in the project root (same folder as package.json):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials from Step 4.

**Important**: The `.env.local` file is ignored by git (for security), so you'll need to add these credentials again when deploying.

### Step 6: Install Dependencies

Open your terminal in the project folder and run:

```bash
cd cravers-joy-admin
npm install
```

This installs all the required packages including:
- Next.js
- React
- Supabase client
- TypeScript types

### Step 7: Run the Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

Open http://localhost:3000 in your browser to see the website.

### Step 8: Create Your Admin Account

1. Go to http://localhost:3000/admin/signup
2. Enter your email address
3. Enter a password (minimum 6 characters)
4. Click **"Create Account"**
5. Check your email for a confirmation link from Supabase
6. Click the confirmation link
7. Go to http://localhost:3000/admin/login
8. Enter your email and password
9. Click **"Sign In"**

You're now in the admin dashboard!

### Step 9: Add Initial Content

Now you can add content through the admin panel:

**Categories** (start here):
1. Go to **Categories** in the admin menu
2. Add categories like:
   - Birthday 🎂
   - Wedding 💍
   - Kids 🦄
   - Signature 🧺
   - Cupcakes 🧁
   - Bento 🍱

**Delivery Areas**:
1. Go to **Settings**
2. Add delivery areas with prices:
   - Kenyatta Road - KSh 300
   - Juja - KSh 500
   - Ruiru - KSh 600
   - Thika - KSh 800
   - Nairobi CBD - KSh 1000

**Cake Flavors**:
1. Go to **Settings**
2. Add flavors with per-kg prices:
   - Vanilla - KSh 1800
   - Chocolate - KSh 2000
   - Red Velvet - KSh 2800
   - Black Forest - KSh 2400

**Cakes**:
1. Go to **Cakes**
2. Click **"Add New Cake"**
3. Upload an image
4. Fill in the details
5. Set it as "Active"
6. Click **"Create Cake"**

**Carousel Slides**:
1. Go to **Carousel**
2. Add slides for the homepage hero section
3. Set the order index to control slide order

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cravers-joy-admin.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Click **"Import"** next to your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **"Deploy"**
6. Wait for deployment (1-2 minutes)

Your site will be live at a URL like `https://cravers-joy-admin.vercel.app`

### Step 3: Custom Domain (Optional)

1. In Vercel, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `craversjoycakes.com`)
4. Follow the DNS instructions provided

---

## Troubleshooting

### "Failed to upload image"
- Make sure the `cake-images` bucket is public
- Check that the folder exists in Storage
- Verify your Supabase credentials in `.env.local`

### "Redirects to login page"
- Make sure you're logged in
- Check that Supabase Auth is enabled
- Clear your browser cookies and try again

### "Content not showing on website"
- Check that items are marked as "Active" in admin
- Verify the database has data
- Check browser console for errors (F12)

### "Middleware error"
- Make sure you removed the deprecated `@supabase/auth-helpers-nextjs` package
- Verify `@supabase/ssr` is installed

---

## Next Steps

After setup:

1. **Add all your cakes** with images and prices
2. **Set up the carousel** with your best cakes
3. **Create offer banners** for special promotions
4. **Add testimonials** from happy customers
5. **Test the order form** to ensure WhatsApp integration works
6. **Deploy to Vercel** to go live

---

## Support

For more help:
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
