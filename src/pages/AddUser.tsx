import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, UserIcon, Mail, Shield, Upload, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import type { User } from '../types';

export function AddUser() {
  const navigate = useNavigate();
  const { addUser } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'estimator',
    password: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, avatar: 'Image must be less than 5MB' }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'File must be an image' }));
        return;
      }

      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: formData.role as 'admin' | 'estimator',
      avatar: avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
    };

    addUser(newUser);
    navigate(`/users/${newUser.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new user account and set their permissions.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="relative">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                {errors.avatar && (
                  <p className="text-sm text-red-600 mt-1">{errors.avatar}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`pl-10 block w-full rounded-md shadow-sm ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } focus:ring-blue-500 focus:border-blue-500`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`pl-10 block w-full rounded-md shadow-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } focus:ring-blue-500 focus:border-blue-500`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="estimator">Estimator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`block w-full rounded-md shadow-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`block w-full rounded-md shadow-sm ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}