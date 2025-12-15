# ============================================
# Sand Global Express - Environment Variables Example
# ============================================
# ⚠️ WARNING: This file contains PLACEHOLDER values only
# Copy this file to .env.local and replace with your actual values
# DO NOT commit .env.local to version control

# ============================================
# Supabase Configuration (REQUIRED)
# ============================================
# Get these from your Supabase project settings: https://app.supabase.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ============================================
# SMTP Email Configuration (REQUIRED)
# ============================================
# For Gmail: Use App Password (not your regular password)
# Enable 2FA and generate App Password: https://support.google.com/accounts/answer/185833
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# ============================================
# Email Addresses (OPTIONAL)
# ============================================
# These can be formatted as "Name <email@example.com>" or just "email@example.com"
SUPPORT_EMAIL=support@example.com
SALES_EMAIL=sales@example.com
ADMIN_EMAIL=admin@example.com

# ============================================
# Google Maps API (OPTIONAL)
# ============================================
# Get your API key from: https://console.cloud.google.com
# Enable: Maps JavaScript API, Geocoding API, Directions API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# ============================================
# Mapbox Token (OPTIONAL)
# ============================================
# Alternative map provider. Get token from: https://account.mapbox.com
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# ============================================
# Site Configuration (OPTIONAL)
# ============================================
# Your production site URL (for email links and redirects)
# Development: http://localhost:3000
# Production: https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=http://localhost:3000
