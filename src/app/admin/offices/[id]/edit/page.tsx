'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { OfficeService } from '@/services/officeService';
import type { Office, UpdateOfficeRequest } from '@/types/office';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditOfficePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [office, setOffice] = useState<Office | null>(null);
  const [formData, setFormData] = useState<UpdateOfficeRequest>({
    name: ''
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
    if (user.role !== 'admin') {
      router.push('/user');
      return;
    }
    fetchOffice();
  }, [user, router, resolvedParams.id]);

  const fetchOffice = async () => {
    try {
      setLoading(true);
      const data = await OfficeService.getOffice(parseInt(resolvedParams.id));
      setOffice(data);
      setFormData({
        name: data.name
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل المكتب',
        message: 'فشل في تحميل بيانات المكتب للتعديل',
        duration: 5000
      });
      router.push('/admin/offices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      showToast({
        type: 'error',
        title: 'خطأ في البيانات',
        message: 'يرجى إدخال اسم المكتب',
        duration: 5000
      });
      return;
    }

    try {
      setSaving(true);
      await OfficeService.updateOffice(parseInt(resolvedParams.id), formData);
      showToast({
        type: 'success',
        title: 'تم التعديل بنجاح',
        message: 'تم تحديث بيانات المكتب بنجاح',
        duration: 3000
      });
      router.push(`/admin/offices/${resolvedParams.id}`);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في التعديل',
        message: 'فشل في تحديث بيانات المكتب',
        duration: 5000
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'admin') {
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
          <p>جاري تحميل بيانات المكتب...</p>
        </div>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-white mb-2">المكتب غير موجود</h3>
          <p className="text-green-300 mb-4">لم يتم العثور على المكتب المطلوب</p>
          <motion.button
            onClick={() => router.push('/admin/offices')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            العودة للمكاتب
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
            <h1 className="text-3xl font-bold text-white mb-2">تعديل المكتب</h1>
            <p className="text-green-300 text-lg">قم بتعديل بيانات المكتب</p>
          </div>
          <motion.button
            onClick={() => router.push(`/admin/offices/${resolvedParams.id}`)}
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
          {/* Office Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-green-300 mb-2">
              اسم المكتب *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
              placeholder="مثال: مسؤول مكتب، رئيس فرع"
              required
              dir="rtl"
            />
            <p className="text-white/60 text-sm mt-2">أدخل اسم المكتب أو المنصب</p>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-end space-x-4 rtl:space-x-reverse"
          >
            <motion.button
              type="button"
              onClick={() => router.push(`/admin/offices/${resolvedParams.id}`)}
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

