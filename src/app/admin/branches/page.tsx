'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { BranchService } from '@/services/branchService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Branch } from '@/types/branch';

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    branchId: number | null;
    branchName: string;
  }>({
    isOpen: false,
    branchId: null,
    branchName: ''
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
    fetchBranches();
  }, [user, router]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await BranchService.getBranches();
      setBranches(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل الفروع',
        message: 'فشل في تحميل قائمة الفروع',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (branch: Branch) => {
    setConfirmDialog({
      isOpen: true,
      branchId: branch.id,
      branchName: branch.name
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.branchId) return;

    try {
      setDeletingId(confirmDialog.branchId);
      await BranchService.deleteBranch(confirmDialog.branchId);
      setBranches(prev => prev.filter(branch => branch.id !== confirmDialog.branchId));
      showToast({
        type: 'success',
        title: 'تم الحذف بنجاح',
        message: 'تم حذف الفرع بنجاح',
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'فشل في حذف الفرع',
        duration: 5000
      });
    } finally {
      setDeletingId(null);
      setConfirmDialog({
        isOpen: false,
        branchId: null,
        branchName: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({
      isOpen: false,
      branchId: null,
      branchName: ''
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
            <h1 className="text-3xl font-bold text-white mb-2">الفروع</h1>
            <p className="text-green-300 text-lg">إدارة فروع الأمن الداخلي</p>
          </div>
          <motion.button
            onClick={() => router.push('/admin/branches/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة فرع جديد
          </motion.button>
        </div>
      </motion.div>

      {/* Branches Table */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">جاري تحميل الفروع...</p>
          </div>
        ) : branches.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد فروع</h3>
            <p className="text-green-300 mb-4">ابدأ بإضافة أول فرع</p>
            <motion.button
              onClick={() => router.push('/admin/branches/new')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إضافة فرع جديد
            </motion.button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-right text-white font-bold">الاسم بالعربية</th>
                    <th className="px-6 py-4 text-right text-white font-bold">الاسم بالإنجليزية</th>
                    <th className="px-6 py-4 text-right text-white font-bold">المسؤول</th>
                    <th className="px-6 py-4 text-right text-white font-bold">تاريخ الإنشاء</th>
                    <th className="px-6 py-4 text-center text-white font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch, index) => (
                    <motion.tr
                      key={branch.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 text-white font-medium">{branch.name}</td>
                      <td className="px-6 py-4 text-white/80">{branch.trName}</td>
                      <td className="px-6 py-4 text-green-300">{branch.boss || '-'}</td>
                      <td className="px-6 py-4 text-white/80">{formatDate(branch.created_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                          <motion.button
                            onClick={() => router.push(`/admin/branches/${branch.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            عرض
                          </motion.button>
                          <motion.button
                            onClick={() => router.push(`/admin/branches/${branch.id}/edit`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            تعديل
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteClick(branch)}
                            disabled={deletingId === branch.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {deletingId === branch.id ? 'جاري...' : 'حذف'}
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
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{branch.name}</h3>
                      <p className="text-green-300 text-sm">{branch.trName}</p>
                    </div>
                    <p className="text-white/80 text-sm">المسؤول: {branch.boss || '-'}</p>
                    <p className="text-white/60 text-xs">تاريخ الإنشاء: {formatDate(branch.created_at)}</p>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <motion.button
                        onClick={() => router.push(`/admin/branches/${branch.id}`)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        عرض
                      </motion.button>
                      <motion.button
                        onClick={() => router.push(`/admin/branches/${branch.id}/edit`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        تعديل
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteClick(branch)}
                        disabled={deletingId === branch.id}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {deletingId === branch.id ? 'جاري...' : 'حذف'}
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
        message={`هل أنت متأكد من حذف الفرع "${confirmDialog.branchName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deletingId === confirmDialog.branchId}
        type="danger"
      />
    </div>
  );
}

