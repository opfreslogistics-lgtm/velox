-- Create storage bucket for blog cover images and website images
-- This bucket will store blog post cover images and other website assets
--
-- NOTE: After running this SQL, you need to set up storage policies via Supabase Dashboard:
-- 1. Go to Storage > website-images bucket
-- 2. Click on "Policies" tab
-- 3. Add the following policies:
--
-- Policy 1: Public Read Access
--   Policy name: "Public read access"
--   Allowed operation: SELECT
--   Policy definition: (bucket_id = 'website-images')
--
-- Policy 2: Authenticated Upload
--   Policy name: "Authenticated users can upload"
--   Allowed operation: INSERT
--   Policy definition: (bucket_id = 'website-images' AND auth.role() = 'authenticated')
--
-- Policy 3: Authenticated Update
--   Policy name: "Authenticated users can update"
--   Allowed operation: UPDATE
--   Policy definition: (bucket_id = 'website-images' AND auth.role() = 'authenticated')
--
-- Policy 4: Authenticated Delete
--   Policy name: "Authenticated users can delete"
--   Allowed operation: DELETE
--   Policy definition: (bucket_id = 'website-images' AND auth.role() = 'authenticated')

-- Create the website-images bucket if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-images',
  'website-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

