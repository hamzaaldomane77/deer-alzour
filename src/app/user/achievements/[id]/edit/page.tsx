'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { AchievementService } from '@/services/achievementService';
import type { Achievement, UpdateAchievementRequest } from '@/types/achievement';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditAchievementPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState<UpdateAchievementRequest>({
    name: '',
    title: '',
    description: '',
    date: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role === 'admin') {
      router.push('/admin');
      return;
    }
    fetchAchievement();
  }, [user, router, resolvedParams.id]);

  const fetchAchievement = async () => {
    try {
      setLoading(true);
      const data = await AchievementService.getAchievement(parseInt(resolvedParams.id));
      setAchievement(data);
      setFormData({
        name: data.name,
        title: data.title,
        description: data.description,
        date: data.date
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل الإنجاز',
        message: 'فشل في تحميل بيانات الإنجاز للتعديل',
        duration: 5000
      });
      router.push('/user/achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.title || !formData.description || !formData.date) {
      showToast({
        type: 'error',
        title: 'خطأ في البيانات',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        duration: 5000
      });
      return;
    }

    try {
      setSaving(true);
      await AchievementService.updateAchievement(parseInt(resolvedParams.id), formData);
      showToast({
        type: 'success',
        title: 'تم التعديل بنجاح',
        message: 'تم تحديث الإنجاز بنجاح',
        duration: 3000
      });
      router.push(`/user/achievements/${resolvedParams.id}`);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في التعديل',
        message: 'فشل في تحديث الإنجاز',
        duration: 5000
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل بيانات الإنجاز...</p>
        </div>
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-white mb-2">الإنجاز غير موجود</h3>
          <p className="text-green-300 mb-4">لم يتم العثور على الإنجاز المطلوب</p>
          <motion.button
            onClick={() => router.push('/user/achievements')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            العودة للإنجازات
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">تعديل الإنجاز</h1>
            <p className="text-green-300 text-lg">قم بتعديل بيانات إنجازك</p>
          </div>
          <motion.button
            onClick={() => router.push(`/user/achievements/${resolvedParams.id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            العودة للتفاصيل
          </motion.button>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-green-300 mb-2">
                الاسم *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                placeholder="أدخل اسم الإنجاز"
                required
                dir="rtl"
              />
            </motion.div>

            {/* Date */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label htmlFor="date" className="block text-sm font-medium text-green-300 mb-2">
                التاريخ *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label htmlFor="title" className="block text-sm font-medium text-green-300 mb-2">
              اللقب *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
              placeholder="أدخل عنوان الإنجاز"
              required
              dir="rtl"
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label htmlFor="description" className="block text-sm font-medium text-green-300 mb-2">
              الوصف *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="أدخل وصف مفصل للإنجاز"
              required
              dir="rtl"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex justify-end space-x-4 rtl:space-x-reverse"
          >
            <motion.button
              type="button"
              onClick={() => router.push(`/user/achievements/${resolvedParams.id}`)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إلغاء
            </motion.button>
            <motion.button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  جاري الحفظ...
                </div>
              ) : (
                'حفظ التعديلات'
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
