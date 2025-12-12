# Storage Bucket Setup Instructions

After running the SQL migration `migration-add-blog-storage-bucket.sql`, you need to set up storage policies through the Supabase Dashboard.

## Steps to Set Up Storage Policies

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click on "Storage" in the left sidebar

2. **Select the `website-images` bucket**
   - You should see the bucket created by the SQL migration
   - Click on the bucket name

3. **Go to the Policies tab**
   - Click on the "Policies" tab at the top

4. **Add the following policies:**

### Policy 1: Public Read Access
- **Policy name:** `Public read access`
- **Allowed operation:** `SELECT`
- **Policy definition:**
  ```sql
  (bucket_id = 'website-images')
  ```
- **Target roles:** `public`

### Policy 2: Authenticated Upload
- **Policy name:** `Authenticated users can upload`
- **Allowed operation:** `INSERT`
- **Policy definition:**
  ```sql
  (bucket_id = 'website-images' AND auth.role() = 'authenticated')
  ```
- **Target roles:** `authenticated`

### Policy 3: Authenticated Update
- **Policy name:** `Authenticated users can update`
- **Allowed operation:** `UPDATE`
- **Policy definition:**
  ```sql
  (bucket_id = 'website-images' AND auth.role() = 'authenticated')
  ```
- **Target roles:** `authenticated`

### Policy 4: Authenticated Delete
- **Policy name:** `Authenticated users can delete`
- **Allowed operation:** `DELETE`
- **Policy definition:**
  ```sql
  (bucket_id = 'website-images' AND auth.role() = 'authenticated')
  ```
- **Target roles:** `authenticated`

## Alternative: Using SQL with Service Role Key

If you have access to the service role key, you can run this SQL in the Supabase SQL Editor:

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for website-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-images');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload to website-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'website-images' 
  AND auth.role() = 'authenticated'
);

-- Authenticated update
CREATE POLICY "Authenticated users can update website-images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'website-images' 
  AND auth.role() = 'authenticated'
);

-- Authenticated delete
CREATE POLICY "Authenticated users can delete website-images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'website-images' 
  AND auth.role() = 'authenticated'
);
```

**Note:** The service role key has elevated permissions and should only be used in server-side code or with extreme caution.

## Testing

After setting up the policies, test the image upload functionality:
1. Go to `/admin/blog`
2. Create a new blog post
3. Try uploading a featured image
4. The image should upload successfully to the `website-images/blog-covers/` folder

