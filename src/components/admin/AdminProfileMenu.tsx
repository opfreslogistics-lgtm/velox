'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, User, Edit2, X, Save, Upload, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminProfileMenu() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [adminName, setAdminName] = useState('Admin User');
  const [adminRole, setAdminRole] = useState('Super Admin');
  const [adminPhoto, setAdminPhoto] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [editingName, setEditingName] = useState(adminName);
  const [editingRole, setEditingRole] = useState(adminRole);
  const [editingPhoto, setEditingPhoto] = useState(adminPhoto);

  useEffect(() => {
    // Load admin profile from localStorage or Supabase
    const savedName = localStorage.getItem('admin_name');
    const savedRole = localStorage.getItem('admin_role');
    const savedPhoto = localStorage.getItem('admin_photo');
    
    if (savedName) setAdminName(savedName);
    if (savedRole) setAdminRole(savedRole);
    if (savedPhoto) setAdminPhoto(savedPhoto);

    // Also try to get from Supabase auth user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        if (user.user_metadata?.name) setAdminName(user.user_metadata.name);
        if (user.user_metadata?.role) setAdminRole(user.user_metadata.role);
        if (user.user_metadata?.photo) setAdminPhoto(user.user_metadata.photo);
      }
    });
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('demo_admin');
    await supabase.auth.signOut();
    router.replace('/');
  };

  const handleSaveProfile = async () => {
    setAdminName(editingName);
    setAdminRole(editingRole);
    setAdminPhoto(editingPhoto);
    
    // Save to localStorage
    localStorage.setItem('admin_name', editingName);
    localStorage.setItem('admin_role', editingRole);
    localStorage.setItem('admin_photo', editingPhoto);

    // Update Supabase user metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.auth.updateUser({
        data: {
          name: editingName,
          role: editingRole,
          photo: editingPhoto,
        },
      });
    }

    setShowEditModal(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 pl-6 border-l border-white/20 relative">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-white">{adminName}</p>
          <p className="text-xs text-white/70">{adminRole}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="relative focus:outline-none"
          >
            <img 
              src={adminPhoto} 
              alt="Admin" 
              className="w-10 h-10 rounded-full border-2 border-brand-red shadow-lg cursor-pointer hover:border-brand-yellow transition-colors" 
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-black"></div>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{adminName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{adminRole}</p>
              </div>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowEditModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <User size={16} /> Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium text-red-600 dark:text-red-400"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={editingPhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-brand-red object-cover"
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-brand-red text-white rounded-full cursor-pointer hover:bg-brand-redDark transition-colors">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                <input
                  type="text"
                  value={editingRole}
                  onChange={(e) => setEditingRole(e.target.value)}
                  className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-brand-red text-white text-sm font-bold rounded-lg hover:bg-brand-redDark transition-colors flex items-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}