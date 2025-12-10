'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author?: string;
  published_at?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(100);
        if (error) throw error;
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load articles');
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <PageHero title="Newsroom" subtitle="Latest updates, insights, and stories from Velox." />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={post.cover_image || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  alt={post.title}
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Admin'}</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-black dark:text-white">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{post.excerpt || 'Read more'}</p>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">No posts yet.</div>
        )}
      </div>
    </div>
  );
}


