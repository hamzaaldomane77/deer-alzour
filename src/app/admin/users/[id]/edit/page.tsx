'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { UserService } from '@/services/userService';
import type { User, UpdateUserRequest } from '@/types/user';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditUserPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { user, token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    email: ''
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
    fetchUser();
  }, [user, router, resolvedParams.id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUser(parseInt(resolvedParams.id));
      setUserData(data);
      setFormData({
        name: data.name,
        email: data.email
      });
    } catch (error) {
      console.error('خطأ في جلب بيانات المستخدم:', error);
      showToast({
        type: 'error',
        title: 'خطأ في جلب بيانات المستخدم',
        message: 'حدث خطأ أثناء جلب بيانات المستخدم',
        duration: 3000
      });
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.email?.trim()) {
      showToast({
        type: 'error',
        title: 'يرجى ملء جميع الحقول',
        message: 'جميع الحقول مطلوبة',
        duration: 3000
      });
      return;
    }

    try {
      setLoading(true);
      await UserService.updateUser(parseInt(resolvedParams.id), formData);
      showToast({
        type: 'success',
        title: 'تم تحديث المستخدم بنجاح',
        message: 'تم حفظ التغييرات بنجاح',
        duration: 3000
      });
      router.push(`/admin/users/${resolvedParams.id}`);
    } catch (error) {
      console.error('خطأ في تحديث المستخدم:', error);
      showToast({
        type: 'error',
        title: 'خطأ في تحديث المستخدم',
        message: 'حدث خطأ أثناء تحديث المستخدم',
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

  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">المستخدم غير موجود</h2>
          <p className="text-white/80 mb-6">المستخدم المطلوب غير موجود أو تم حذفه</p>
          <motion.button
            onClick={() => router.push('/admin/users')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            العودة إلى قائمة المستخدمين
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <motion.button
            onClick={() => router.push(`/admin/users/${resolvedParams.id}`)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-white">تعديل المستخدم</h1>
            <p className="text-white/70">تعديل بيانات {userData.name}</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-white font-medium mb-2">
              الاسم الكامل *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
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
              value={formData.email || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </div>

          {/* Role Display */}
          <div>
            <label className="block text-white font-medium mb-2">
              نوع المستخدم
            </label>
            <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userData.role === 'admin' 
                  ? 'bg-red-500/20 text-red-300' 
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {userData.role === 'admin' ? 'مدير' : 'مستخدم'}
              </span>
              <p className="text-white/60 text-sm mt-2">
                نوع المستخدم لا يمكن تغييره من هنا
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <motion.button
              type="button"
              onClick={() => router.push(`/admin/users/${resolvedParams.id}`)}
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
                  <span>جاري التحديث...</span>
                </div>
              ) : (
                'تحديث المستخدم'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
