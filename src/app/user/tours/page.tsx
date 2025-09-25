'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { TourService } from '@/services/tourService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Tour } from '@/types/tour';

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    tourId: number | null;
    tourTitle: string;
  }>({
    isOpen: false,
    tourId: null,
    tourTitle: ''
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
    fetchTours();
  }, [user, isLoading, router]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await TourService.getUserTours();
      setTours(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل الجولات',
        message: 'فشل في تحميل قائمة الجولات',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (tour: Tour) => {
    setConfirmDialog({
      isOpen: true,
      tourId: tour.id,
      tourTitle: tour.title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.tourId) return;

    try {
      setDeleting(confirmDialog.tourId);
      await TourService.deleteTour(confirmDialog.tourId);
      setTours(tours.filter(tour => tour.id !== confirmDialog.tourId));
      showToast({
        type: 'success',
        title: 'تم الحذف بنجاح',
        message: 'تم حذف الجولة بنجاح',
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'فشل في حذف الجولة',
        duration: 5000
      });
    } finally {
      setDeleting(null);
      setConfirmDialog({
        isOpen: false,
        tourId: null,
        tourTitle: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({
      isOpen: false,
      tourId: null,
      tourTitle: ''
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
          <p>جاري تحميل الجولات...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">الجولات الميدانية</h1>
            <p className="text-green-300 text-lg">إدارة جولاتك الميدانية</p>
          </div>
          <motion.button
            onClick={() => router.push('/user/tours/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة جولة جديدة
          </motion.button>
        </div>
      </motion.div>

      {/* Tours List */}
      {tours.length === 0 ? (
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد جولات</h3>
          <p className="text-green-300 mb-6">لم تقم بإضافة أي جولات ميدانية بعد</p>
          <motion.button
            onClick={() => router.push('/user/tours/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة أول جولة
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/user/tours/${tour.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">🗺️</div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/tours/${tour.id}/edit`);
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
                      handleDeleteClick(tour);
                    }}
                    disabled={deleting === tour.id}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {deleting === tour.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{tour.title}</h3>
              <p className="text-green-300 text-sm mb-2">{tour.name}</p>
              <p className="text-white/80 text-sm mb-4 line-clamp-3">{tour.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-300">📅 {formatDate(tour.date)}</span>
                <span className="text-white/60">#{tour.id}</span>
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
        message={`هل أنت متأكد من حذف الجولة "${confirmDialog.tourTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deleting === confirmDialog.tourId}
        type="danger"
      />
    </div>
  );
}
