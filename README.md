# Sand Global Express

A modern logistics and shipment tracking platform built with Next.js, TypeScript, and Supabase.

## Features

- 🚚 Real-time shipment tracking
- 📧 Email notifications for shipment updates
- 🗺️ Interactive maps with Google Maps integration
- 📊 Admin dashboard for managing shipments
- 📝 Blog system
- 💼 Contact forms and quote requests
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- SMTP email account (Gmail, Outlook, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/opfreslogistics-lgtm/velox.git
cd velox
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SMTP Configuration (Required for email functionality)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Optional Admin Emails
SUPPORT_EMAIL=support@example.com
SALES_EMAIL=sales@example.com
ADMIN_EMAIL=admin@example.com

# Google Maps API Key (Optional - for map features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Site URL (Optional - for email links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up the database:
Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor.

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables**: Have all your environment variables ready

### Steps

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   In Vercel dashboard, go to Settings → Environment Variables and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
   - `SUPPORT_EMAIL` (optional)
   - `SALES_EMAIL` (optional)
   - `ADMIN_EMAIL` (optional)
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel domain)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

### Post-Deployment

1. Update `NEXT_PUBLIC_SITE_URL` in Vercel to your production domain
2. Test email functionality using `/api/test-email`
3. Verify Supabase connection
4. Test shipment creation and tracking

## Environment Variables

### Required

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SMTP_HOST` - SMTP server hostname (e.g., smtp.gmail.com)
- `SMTP_PORT` - SMTP port (usually 587 or 465)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASS` - SMTP password or app password
- `SMTP_FROM` - Email address to send from

### Optional

- `SUPPORT_EMAIL` - Support email address
- `SALES_EMAIL` - Sales email address
- `ADMIN_EMAIL` - Admin email address
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For map features
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for email links)

## Project Structure

```
velox-logistics/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and services
│   └── types/           # TypeScript types
├── public/              # Static assets
├── supabase-schema.sql  # Database schema
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Testing Email

Use the test endpoint to verify email configuration:

```bash
curl -X POST https://your-domain.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

## Troubleshooting

See `EMAIL_DEBUG_GUIDE.md` for email debugging help.

## License

Private - All rights reserved
