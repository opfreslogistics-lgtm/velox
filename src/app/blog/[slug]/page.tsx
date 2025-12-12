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
    <div className="min-h-screen pb-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-black dark:text-white hover:text-brand-red mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {post && (
          <>
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/50 p-8 lg:p-12 mb-8 border border-gray-100 dark:border-gray-700">
              <div className="space-y-4 mb-8">
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Newsroom</span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-brand-black dark:text-white leading-tight">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-red" /> 
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Draft'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-brand-red" /> 
                    {post.author || 'Admin'}
                  </span>
                </div>
              </div>

              {post.cover_image && (
                <div className="rounded-xl overflow-hidden shadow-xl mb-10 border border-gray-200 dark:border-gray-700">
                  <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-brand-black dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-brand-red dark:prose-a:text-brand-red prose-strong:text-brand-black dark:prose-strong:text-white prose-code:text-brand-red dark:prose-code:text-brand-red prose-blockquote:border-brand-red dark:prose-blockquote:border-brand-red prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300">
                {post.content ? (
                  <div 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-lg">Content coming soon.</p>
                )}
              </div>
            </article>
          </>
        )}
      </div>
    </div>
  );
}


