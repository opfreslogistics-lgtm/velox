'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadImageToStorage } from '@/lib/storage';
import { Plus, Loader2, AlertCircle, Trash2, Save, Edit, Upload, X, Image as ImageIcon } from 'lucide-react';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

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

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      setError(null);
      const imageUrl = await uploadImageToStorage(file, 'website-images', 'blog-covers');
      setEditing({ ...editing!, cover_image: imageUrl });
      setImagePreview(imageUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTitleChange = (title: string) => {
    const newSlug = generateSlug(title);
    setEditing({ ...editing!, title, slug: newSlug });
  };

  const handleSave = async (post: BlogPost) => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        ...post,
        slug: post.slug || generateSlug(post.title),
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
      setImagePreview(null);
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
          onClick={() => { 
            setEditing({ ...EMPTY, slug: '' }); 
            setImagePreview(null);
            setIsModalOpen(true); 
          }}
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
                    <button onClick={() => { 
                      setEditing(p); 
                      setImagePreview(p.cover_image || null);
                      setIsModalOpen(true); 
                    }} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <button 
                onClick={() => { 
                  setIsModalOpen(false); 
                  setEditing(null); 
                  setImagePreview(null);
                }} 
                className="text-gray-500 hover:text-brand-red"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title - Auto-generates slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                <input
                  type="text"
                  value={editing.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Slug - Auto-generated but editable */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Slug (auto-generated)</label>
                <input
                  type="text"
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                  placeholder="post-slug"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Featured Image</label>
                <div className="space-y-3">
                  {(editing.cover_image || imagePreview) && (
                    <div className="relative group">
                      <img
                        src={editing.cover_image || imagePreview || ''}
                        alt="Cover preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                      <button
                        onClick={() => {
                          setEditing({ ...editing, cover_image: '' });
                          setImagePreview(null);
                        }}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <label className={`flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    uploadingImage 
                      ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-brand-red hover:bg-brand-red/5 dark:hover:bg-brand-red/10'
                  }`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (5MB max)
                          if (file.size > 5242880) {
                            setError('Image size must be less than 5MB');
                            return;
                          }
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            setError('Please select a valid image file');
                            return;
                          }
                          setImagePreview(URL.createObjectURL(file));
                          handleImageUpload(file);
                        }
                      }}
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-brand-red" size={24} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Uploading image...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-brand-red/10 dark:bg-brand-red/20 rounded-full">
                          <ImageIcon className="text-brand-red" size={24} />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                            {editing.cover_image ? 'Replace Featured Image' : 'Upload Featured Image'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                            JPG, PNG, WEBP or GIF (max 5MB)
                          </span>
                        </div>
                      </div>
                    )}
                  </label>
                  {editing.cover_image && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Or paste image URL</label>
                      <input
                        type="text"
                        value={editing.cover_image}
                        onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                        className="w-full p-3 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Author */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Author</label>
                <input
                  type="text"
                  value={editing.author || ''}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                  placeholder="Author name"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Excerpt</label>
                <textarea
                  value={editing.excerpt || ''}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>

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
                onClick={() => { 
                  setIsModalOpen(false); 
                  setEditing(null); 
                  setImagePreview(null);
                }}
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


