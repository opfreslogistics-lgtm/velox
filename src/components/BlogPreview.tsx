import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author?: string;
  published_at?: string;
}

const BlogPreview: React.FC = () => {
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
          .limit(3);
        if (error) throw error;
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load articles');
      }
    };
    load();
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-brand-red font-bold uppercase tracking-widest text-sm">Newsroom</span>
            <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mt-2">Latest Insights</h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-brand-black dark:text-white font-bold hover:text-brand-red transition-colors">
            View All Articles <ArrowRight size={18} />
          </Link>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Link href={`/blog/${post.slug}`} key={i} className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.cover_image || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80'} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-brand-yellow text-brand-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {post.author || 'Sand Global Express'}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Admin'}</span>
                </div>
                <h3 className="text-xl font-bold text-brand-black dark:text-white mb-4 leading-tight group-hover:text-brand-red transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{post.excerpt || 'Read the latest from our newsroom.'}</p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-black dark:hover:text-white uppercase tracking-wide">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
          {posts.length === 0 && !error && (
            <div className="col-span-3 text-center text-gray-500 dark:text-gray-400">No articles yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;