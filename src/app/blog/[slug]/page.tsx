'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, User, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  author?: string;
  published_at?: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setError(null);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Article not found');
      }
    };
    load();
  }, [slug]);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-black dark:text-white hover:text-brand-red mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {post && (
          <>
            <div className="space-y-3 mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Newsroom</span>
              <h1 className="text-4xl font-extrabold text-brand-black dark:text-white leading-tight">{post.title}</h1>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
                <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Admin'}</span>
              </div>
            </div>

            {post.cover_image && (
              <div className="rounded-2xl overflow-hidden shadow-lg mb-10">
                <img src={post.cover_image} alt={post.title} className="w-full h-[360px] object-cover" />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">Content coming soon.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


