'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { VisitService } from '@/services/visitService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Visit } from '@/types/visit';

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    visitId: number | null;
    visitTitle: string;
  }>({
    isOpen: false,
    visitId: null,
    visitTitle: ''
  });
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
    fetchVisits();
  }, [user, isLoading, router]);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const data = await VisitService.getUserVisits();
      setVisits(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل الزيارات',
        message: 'فشل في تحميل قائمة الزيارات',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (visit: Visit) => {
    setConfirmDialog({
      isOpen: true,
      visitId: visit.id,
      visitTitle: visit.title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.visitId) return;

    try {
      setDeleting(confirmDialog.visitId);
      await VisitService.deleteVisit(confirmDialog.visitId);
      setVisits(visits.filter(visit => visit.id !== confirmDialog.visitId));
      showToast({
        type: 'success',
        title: 'تم الحذف بنجاح',
        message: 'تم حذف الزيارة بنجاح',
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'فشل في حذف الزيارة',
        duration: 5000
      });
    } finally {
      setDeleting(null);
      setConfirmDialog({
        isOpen: false,
        visitId: null,
        visitTitle: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({
      isOpen: false,
      visitId: null,
      visitTitle: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
          <p>جاري تحميل الزيارات...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">الزيارات المدنية</h1>
            <p className="text-green-300 text-lg">إدارة زياراتك المدنية</p>
          </div>
          <motion.button
            onClick={() => router.push('/user/visits/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة زيارة جديدة
          </motion.button>
        </div>
      </motion.div>

      {/* Visits List */}
      {visits.length === 0 ? (
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد زيارات</h3>
          <p className="text-green-300 mb-6">لم تقم بإضافة أي زيارات مدنية بعد</p>
          <motion.button
            onClick={() => router.push('/user/visits/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة أول زيارة
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit, index) => (
            <motion.div
              key={visit.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/user/visits/${visit.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">🏛️</div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/visits/${visit.id}/edit`);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(visit);
                    }}
                    disabled={deleting === visit.id}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {deleting === visit.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{visit.title}</h3>
              <p className="text-green-300 text-sm mb-2">{visit.name}</p>
              <p className="text-white/80 text-sm mb-4 line-clamp-3">{visit.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-300">📅 {formatDate(visit.date)}</span>
                <span className="text-white/60">#{visit.id}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف الزيارة "${confirmDialog.visitTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deleting === confirmDialog.visitId}
        type="danger"
      />
    </div>
  );
}
