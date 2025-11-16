'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { UserService } from '@/services/userService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { User } from '@/types/user';

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: ''
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
    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error);
      showToast({
        type: 'error',
        title: 'خطأ في جلب المستخدمين',
        message: 'حدث خطأ أثناء جلب قائمة المستخدمين',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      userId: user.id,
      userName: user.name
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.userId) return;
    
    try {
      setDeleting(confirmDialog.userId);
      await UserService.deleteUser(confirmDialog.userId);
      setUsers(users.filter(user => user.id !== confirmDialog.userId));
      showToast({
        type: 'success',
        title: 'تم حذف المستخدم بنجاح',
        message: 'تم حذف المستخدم من النظام',
        duration: 3000
      });
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error);
      showToast({
        type: 'error',
        title: 'خطأ في حذف المستخدم',
        message: 'حدث خطأ أثناء حذف المستخدم',
        duration: 3000
      });
    } finally {
      setDeleting(null);
      setConfirmDialog({ isOpen: false, userId: null, userName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, userId: null, userName: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-medium">
          مدير
        </span>
      );
    }
    return (
      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
        مستخدم
      </span>
    );
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
            <h1 className="text-3xl font-bold text-white mb-2">المستخدمين</h1>
            <p className="text-green-300 text-lg">إدارة جميع المستخدمين في النظام</p>
          </div>
          <motion.button
            onClick={() => router.push('/admin/users/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة مستخدم جديد
          </motion.button>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">جاري تحميل المستخدمين...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">لا يوجد مستخدمين</h3>
            <p className="text-green-300 mb-4">ابدأ بإضافة مستخدم جديد</p>
            <motion.button
              onClick={() => router.push('/admin/users/new')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إضافة مستخدم جديد
            </motion.button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-right text-white font-bold">الاسم</th>
                    <th className="px-6 py-4 text-right text-white font-bold">البريد الإلكتروني</th>
                    <th className="px-6 py-4 text-right text-white font-bold">الدور</th>
                    <th className="px-6 py-4 text-right text-white font-bold">الفرع</th>
                    <th className="px-6 py-4 text-right text-white font-bold">المكتب</th>
                    <th className="px-6 py-4 text-right text-white font-bold">تاريخ الإنشاء</th>
                    <th className="px-6 py-4 text-center text-white font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem, index) => (
                    <motion.tr
                      key={userItem.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 text-white">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{userItem.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{userItem.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/80">{userItem.email}</td>
                      <td className="px-6 py-4">{getRoleBadge(userItem.role)}</td>
                      <td className="px-6 py-4 text-green-300">{userItem.branch?.name || '-'}</td>
                      <td className="px-6 py-4 text-white/80">{userItem.office?.name || '-'}</td>
                      <td className="px-6 py-4 text-white/80">{formatDate(userItem.created_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                          <motion.button
                            onClick={() => router.push(`/admin/users/${userItem.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            عرض
                          </motion.button>
                          <motion.button
                            onClick={() => router.push(`/admin/users/${userItem.id}/edit`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            تعديل
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteClick(userItem)}
                            disabled={deleting === userItem.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {deleting === userItem.id ? 'جاري...' : 'حذف'}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden p-4 space-y-4">
              {users.map((userItem, index) => (
                <motion.div
                  key={userItem.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="space-y-3">
                    {/* User Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{userItem.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{userItem.name}</h3>
                          <p className="text-white/70 text-sm">{userItem.email}</p>
                        </div>
                      </div>
                      {getRoleBadge(userItem.role)}
                    </div>

                    {/* User Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">الفرع:</span>
                        <span className="text-green-300">{userItem.branch?.name || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">المكتب:</span>
                        <span className="text-white/80">{userItem.office?.name || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">تاريخ الإنشاء:</span>
                        <span className="text-white/80">{formatDate(userItem.created_at)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 rtl:space-x-reverse pt-2 border-t border-white/10">
                      <motion.button
                        onClick={() => router.push(`/admin/users/${userItem.id}`)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        عرض
                      </motion.button>
                      <motion.button
                        onClick={() => router.push(`/admin/users/${userItem.id}/edit`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        تعديل
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteClick(userItem)}
                        disabled={deleting === userItem.id}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {deleting === userItem.id ? 'جاري...' : 'حذف'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف المستخدم "${confirmDialog.userName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deleting === confirmDialog.userId}
        type="danger"
      />
    </div>
  );
}
