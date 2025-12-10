-- Create blog_posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  author text,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Helpful indexes
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);



