'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { AchievementService } from '@/services/achievementService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Achievement } from '@/types/achievement';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    achievementId: number | null;
    achievementTitle: string;
  }>({
    isOpen: false,
    achievementId: null,
    achievementTitle: ''
  });
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
    fetchAchievements();
  }, [user, router]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await AchievementService.getAchievements();
      setAchievements(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل الإنجازات',
        message: 'فشل في تحميل قائمة الإنجازات',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (achievement: Achievement) => {
    setConfirmDialog({
      isOpen: true,
      achievementId: achievement.id,
      achievementTitle: achievement.title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.achievementId) return;

    try {
      setDeletingId(confirmDialog.achievementId);
      await AchievementService.deleteAchievement(confirmDialog.achievementId);
      setAchievements(prev => prev.filter(achievement => achievement.id !== confirmDialog.achievementId));
      showToast({
        type: 'success',
        title: 'تم الحذف بنجاح',
        message: 'تم حذف الإنجاز بنجاح',
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'فشل في حذف الإنجاز',
        duration: 5000
      });
    } finally {
      setDeletingId(null);
      setConfirmDialog({
        isOpen: false,
        achievementId: null,
        achievementTitle: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({
      isOpen: false,
      achievementId: null,
      achievementTitle: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
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
            <h1 className="text-3xl font-bold text-white mb-2">الإنجازات</h1>
            <p className="text-green-300 text-lg">إدارة إنجازاتك الشخصية</p>
          </div>
          <motion.button
            onClick={() => router.push('/user/achievements/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة إنجاز جديد
          </motion.button>
        </div>
      </motion.div>

      {/* Achievements Table */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">جاري تحميل الإنجازات...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد إنجازات</h3>
            <p className="text-green-300 mb-4">ابدأ بإضافة إنجازك الأول</p>
            <motion.button
              onClick={() => router.push('/user/achievements/new')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إضافة إنجاز جديد
            </motion.button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-right text-white font-bold">الاسم</th>
                    <th className="px-6 py-4 text-right text-white font-bold">العنوان</th>
                    <th className="px-6 py-4 text-right text-white font-bold">التاريخ</th>
                    <th className="px-6 py-4 text-right text-white font-bold">الوصف</th>
                    <th className="px-6 py-4 text-center text-white font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((achievement, index) => (
                    <motion.tr
                      key={achievement.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 text-white">{achievement.name}</td>
                      <td className="px-6 py-4 text-white">{achievement.title}</td>
                      <td className="px-6 py-4 text-green-300">{formatDate(achievement.date)}</td>
                      <td className="px-6 py-4 text-white/80 max-w-xs truncate">{achievement.description}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                          <motion.button
                            onClick={() => router.push(`/user/achievements/${achievement.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            عرض
                          </motion.button>
                          <motion.button
                            onClick={() => router.push(`/user/achievements/${achievement.id}/edit`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            تعديل
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteClick(achievement)}
                            disabled={deletingId === achievement.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {deletingId === achievement.id ? 'جاري...' : 'حذف'}
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
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{achievement.title}</h3>
                      <p className="text-green-300 text-sm">{achievement.name}</p>
                    </div>
                    <p className="text-white/80 text-sm">{achievement.description}</p>
                    <p className="text-green-300 text-sm">التاريخ: {formatDate(achievement.date)}</p>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <motion.button
                        onClick={() => router.push(`/user/achievements/${achievement.id}`)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        عرض
                      </motion.button>
                      <motion.button
                        onClick={() => router.push(`/user/achievements/${achievement.id}/edit`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        تعديل
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteClick(achievement)}
                        disabled={deletingId === achievement.id}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {deletingId === achievement.id ? 'جاري...' : 'حذف'}
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
        message={`هل أنت متأكد من حذف الإنجاز "${confirmDialog.achievementTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deletingId === confirmDialog.achievementId}
        type="danger"
      />
    </div>
  );
}
