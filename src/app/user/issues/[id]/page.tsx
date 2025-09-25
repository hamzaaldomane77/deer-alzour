'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { IssueService } from '@/services/issueService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Issue } from '@/types/issue';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function IssueDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role === 'admin') {
      router.push('/admin');
      return;
    }
    fetchIssue();
  }, [user, isLoading, router, resolvedParams.id]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const data = await IssueService.getIssue(parseInt(resolvedParams.id));
      setIssue(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل القضية',
        message: 'فشل في تحميل تفاصيل القضية',
        duration: 5000
      });
      router.push('/user/issues');
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
      await IssueService.deleteIssue(parseInt(resolvedParams.id));
      showToast({
        type: 'success',
        title: 'تم الحذف بنجاح',
        message: 'تم حذف القضية بنجاح',
        duration: 3000
      });
      router.push('/user/issues');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'فشل في حذف القضية',
        duration: 5000
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
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <p>جاري تحميل تفاصيل القضية...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-white mb-2">القضية غير موجودة</h3>
          <p className="text-green-300 mb-4">لم يتم العثور على القضية المطلوبة</p>
          <motion.button
            onClick={() => router.push('/user/issues')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            العودة للقضايا
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
            <h1 className="text-3xl font-bold text-white mb-2">تفاصيل القضية</h1>
            <p className="text-green-300 text-lg">معلومات مفصلة عن قضيتك</p>
          </div>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <motion.button
              onClick={() => router.push('/user/issues')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              العودة للقضايا
            </motion.button>
            <motion.button
              onClick={() => router.push(`/user/issues/${issue.id}/edit`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تعديل
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Issue Details */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Issue Icon and Title */}
          <div className="text-center">
            <div className="text-8xl mb-4">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-2">{issue.title}</h2>
            <p className="text-green-300 text-lg">{issue.name}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <motion.div
              className="bg-white/5 rounded-xl p-4 border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="text-2xl">📅</div>
                <div>
                  <h3 className="text-white font-bold">تاريخ القضية</h3>
                  <p className="text-green-300">{formatDate(issue.date)}</p>
                </div>
              </div>
            </motion.div>

            {/* Created At */}
            <motion.div
              className="bg-white/5 rounded-xl p-4 border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="text-2xl">⏰</div>
                <div>
                  <h3 className="text-white font-bold">تاريخ الإنشاء</h3>
                  <p className="text-green-300">{formatDateTime(issue.created_at)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            className="bg-white/5 rounded-xl p-4 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="text-2xl">📝</div>
              <div>
                <h3 className="text-white font-bold mb-2">الوصف</h3>
                <p className="text-white/80 leading-relaxed">{issue.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex justify-center space-x-4 rtl:space-x-reverse pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={() => router.push(`/user/issues/${issue.id}/edit`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تعديل القضية
            </motion.button>
            <motion.button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {deleting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  جاري الحذف...
                </div>
              ) : (
                'حذف القضية'
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف القضية "${issue?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deleting}
        type="danger"
      />
    </div>
  );
}
