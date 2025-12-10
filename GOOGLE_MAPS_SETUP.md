# Google Maps Setup Guide

## Step 1: Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Directions API**
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Replace `your_google_maps_api_key_here` with your actual API key.

## Step 3: Restart Your Dev Server

After adding the API key, restart your Next.js development server:

```bash
npm run dev
```

## Step 4: (Optional) Restrict Your API Key

For production, it's recommended to restrict your API key:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domain (e.g., `https://yourdomain.com/*`)
5. Under "API restrictions", select "Restrict key"
6. Choose: Maps JavaScript API, Geocoding API, Directions API

## Troubleshooting

- **Map not showing**: Check that your API key is correct and the APIs are enabled
- **"This page can't load Google Maps correctly"**: Verify your API key restrictions allow your domain
- **Geocoding errors**: Make sure Geocoding API is enabled

## Cost Information

Google Maps has a free tier:
- $200 free credit per month
- Maps JavaScript API: Free for up to 28,000 loads per month
- Geocoding API: Free for up to 40,000 requests per month
- Directions API: Free for up to 40,000 requests per month

For most small to medium applications, this should be sufficient.


