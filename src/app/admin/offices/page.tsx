'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { OfficeService } from '@/services/officeService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Office } from '@/types/office';

export default function OfficesPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    officeId: number | null;
    officeName: string;
  }>({
    isOpen: false,
    officeId: null,
    officeName: ''
  });
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
    fetchOffices();
  }, [user, router]);

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const data = await OfficeService.getOffices();
      setOffices(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل المكاتب',
        message: 'فشل في تحميل قائمة المكاتب',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (office: Office) => {
    setConfirmDialog({
      isOpen: true,
      officeId: office.id,
      officeName: office.name
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.officeId) return;

    try {
      setDeletingId(confirmDialog.officeId);
      await OfficeService.deleteOffice(confirmDialog.officeId);
      setOffices(prev => prev.filter(office => office.id !== confirmDialog.officeId));
      showToast({
        type: 'success',
        title: 'تم الحذف بنجاح',
        message: 'تم حذف المكتب بنجاح',
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'فشل في حذف المكتب',
        duration: 5000
      });
    } finally {
      setDeletingId(null);
      setConfirmDialog({
        isOpen: false,
        officeId: null,
        officeName: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({
      isOpen: false,
      officeId: null,
      officeName: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
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
            <h1 className="text-3xl font-bold text-white mb-2">المكاتب</h1>
            <p className="text-green-300 text-lg">إدارة المكاتب والمناصب</p>
          </div>
          <motion.button
            onClick={() => router.push('/admin/offices/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة مكتب جديد
          </motion.button>
        </div>
      </motion.div>

      {/* Offices Table */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">جاري تحميل المكاتب...</p>
          </div>
        ) : offices.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد مكاتب</h3>
            <p className="text-green-300 mb-4">ابدأ بإضافة أول مكتب</p>
            <motion.button
              onClick={() => router.push('/admin/offices/new')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إضافة مكتب جديد
            </motion.button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-right text-white font-bold">الرقم</th>
                    <th className="px-6 py-4 text-right text-white font-bold">اسم المكتب</th>
                    <th className="px-6 py-4 text-right text-white font-bold">تاريخ الإنشاء</th>
                    <th className="px-6 py-4 text-right text-white font-bold">آخر تحديث</th>
                    <th className="px-6 py-4 text-center text-white font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {offices.map((office, index) => (
                    <motion.tr
                      key={office.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 text-white/80">{office.id}</td>
                      <td className="px-6 py-4 text-white font-medium">{office.name}</td>
                      <td className="px-6 py-4 text-green-300">{formatDate(office.created_at)}</td>
                      <td className="px-6 py-4 text-white/80">{formatDate(office.updated_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                          <motion.button
                            onClick={() => router.push(`/admin/offices/${office.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            عرض
                          </motion.button>
                          <motion.button
                            onClick={() => router.push(`/admin/offices/${office.id}/edit`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            تعديل
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteClick(office)}
                            disabled={deletingId === office.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {deletingId === office.id ? 'جاري...' : 'حذف'}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {offices.map((office, index) => (
                <motion.div
                  key={office.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{office.name}</h3>
                      <p className="text-green-300 text-sm">رقم: {office.id}</p>
                    </div>
                    <div className="text-white/60 text-xs space-y-1">
                      <p>تاريخ الإنشاء: {formatDate(office.created_at)}</p>
                      <p>آخر تحديث: {formatDate(office.updated_at)}</p>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <motion.button
                        onClick={() => router.push(`/admin/offices/${office.id}`)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        عرض
                      </motion.button>
                      <motion.button
                        onClick={() => router.push(`/admin/offices/${office.id}/edit`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        تعديل
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteClick(office)}
                        disabled={deletingId === office.id}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {deletingId === office.id ? 'جاري...' : 'حذف'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف المكتب "${confirmDialog.officeName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deletingId === confirmDialog.officeId}
        type="danger"
      />
    </div>
  );
}

