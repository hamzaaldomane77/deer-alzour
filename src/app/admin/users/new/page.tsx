'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { UserService } from '@/services/userService';
import type { CreateUserRequest } from '@/types/user';

export default function NewUserPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/user');
      return;
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showToast({
        type: 'error',
        title: 'يرجى ملء جميع الحقول',
        message: 'جميع الحقول مطلوبة',
        duration: 3000
      });
      return;
    }

    if (formData.password.length < 8) {
      showToast({
        type: 'error',
        title: 'كلمة المرور قصيرة',
        message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        duration: 3000
      });
      return;
    }

    try {
      setLoading(true);
      await UserService.createUser(formData);
      showToast({
        type: 'success',
        title: 'تم إنشاء المستخدم بنجاح',
        message: 'تم إضافة المستخدم الجديد إلى النظام',
        duration: 3000
      });
      router.push('/admin/users');
    } catch (error) {
      console.error('خطأ في إنشاء المستخدم:', error);
      showToast({
        type: 'error',
        title: 'خطأ في إنشاء المستخدم',
        message: 'حدث خطأ أثناء إنشاء المستخدم',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <motion.button
            onClick={() => router.push('/admin/users')}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <h1 className="text-3xl font-bold text-white">إضافة مستخدم جديد</h1>
        </div>
        <p className="text-white/70">أدخل بيانات المستخدم الجديد</p>
      </motion.div>

      {/* Form */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-white font-medium mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="أدخل البريد الإلكتروني"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              كلمة المرور *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
              minLength={8}
              required
            />
            <p className="text-white/60 text-sm mt-1">كلمة المرور يجب أن تكون 8 أحرف على الأقل</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <motion.button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إلغاء
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الإنشاء...</span>
                </div>
              ) : (
                'إنشاء المستخدم'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
