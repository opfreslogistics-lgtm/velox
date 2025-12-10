'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Loader2, AlertCircle, Trash2, Save, Edit } from 'lucide-react';
import { nanoid } from 'nanoid';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  author?: string;
  published_at?: string;
}

const EMPTY: BlogPost = { title: '', slug: '', excerpt: '', content: '', cover_image: '', author: '' };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isDemoMode) {
        setPosts([]);
        setError('Supabase is not configured.');
        return;
      }
      const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (post: BlogPost) => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        ...post,
        slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + nanoid(6),
        published_at: post.published_at || new Date().toISOString(),
      };
      if (post.id) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([payload]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditing(null);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-red">Admin</p>
          <h1 className="text-3xl font-extrabold text-brand-black dark:text-white">Blog Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage newsroom articles.</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY, slug: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-brand-redDark"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-red" size={28} />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Author</th>
                <th className="p-4">Published</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="p-4 font-bold text-brand-black dark:text-white">{p.title}</td>
                  <td className="p-4 text-xs text-gray-500">{p.slug}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{p.author || 'Admin'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{p.published_at ? new Date(p.published_at).toLocaleDateString() : '-'}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => { setEditing(p); setIsModalOpen(true); }} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => p.id && handleDelete(p.id)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td className="p-6 text-center text-gray-500" colSpan={5}>No posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-black dark:text-white">{editing.id ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditing(null); }} className="text-gray-500 hover:text-brand-red">Close</button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {['title', 'slug', 'author', 'cover_image', 'excerpt'].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{field.replace('_', ' ')}</label>
                  <input
                    type="text"
                    value={(editing as any)[field] || ''}
                    onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Content (HTML allowed)</label>
                <textarea
                  value={editing.content || ''}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                  rows={10}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setEditing(null); }}
                className="px-4 py-2 rounded-lg font-bold text-gray-500 hover:text-brand-black dark:text-gray-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={() => handleSave(editing)}
                className="px-6 py-2 rounded-lg font-bold bg-brand-red text-white flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


