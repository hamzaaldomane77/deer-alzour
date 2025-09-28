'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { UserService } from '@/services/userService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { User } from '@/types/user';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { user, token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await UserService.deleteUser(parseInt(resolvedParams.id));
      showToast({
        type: 'success',
        title: 'تم حذف المستخدم بنجاح',
        message: 'تم حذف المستخدم من النظام',
        duration: 3000
      });
      router.push('/admin/users');
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error);
      showToast({
        type: 'error',
        title: 'خطأ في حذف المستخدم',
        message: 'حدث خطأ أثناء حذف المستخدم',
        duration: 3000
      });
    } finally {
      setDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <span className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium">
          مدير
        </span>
      );
    }
    return (
      <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium">
        مستخدم
      </span>
    );
  };

  if (loading) {
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
            <div>
              <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
              <p className="text-white/70">تفاصيل المستخدم</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => router.push(`/admin/users/${resolvedParams.id}/edit`)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تعديل المستخدم
            </motion.button>
            <motion.button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {deleting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الحذف...</span>
                </div>
              ) : (
                'حذف المستخدم'
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* User Details */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{userData.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                <p className="text-white/70">{userData.email}</p>
                <div className="mt-2">
                  {getRoleBadge(userData.role)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-white/70">البريد الإلكتروني:</span>
                <span className="text-white font-medium">{userData.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-white/70">نوع المستخدم:</span>
                <span className="text-white font-medium">
                  {userData.role === 'admin' ? 'مدير' : 'مستخدم'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-white/70">تاريخ الإنشاء:</span>
                <span className="text-white font-medium">{formatDate(userData.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/70">آخر تحديث:</span>
                <span className="text-white font-medium">{formatDate(userData.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">معلومات إضافية</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">حالة البريد الإلكتروني:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData.email_verified_at 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {userData.email_verified_at ? 'مؤكد' : 'غير مؤكد'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">معرف المستخدم:</span>
                  <span className="text-white font-mono text-sm">#{userData.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <motion.button
                  onClick={() => router.push(`/admin/users/${resolvedParams.id}/edit`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✏️ تعديل بيانات المستخدم
                </motion.button>
                <motion.button
                  onClick={() => router.push(`/admin/users/${resolvedParams.id}/change-password`)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔒 تغيير كلمة المرور
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف المستخدم "${userData.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deleting}
        type="danger"
      />
    </div>
  );
}
