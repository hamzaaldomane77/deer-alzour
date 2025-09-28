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
  const { user, token } = useAuth();
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
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة المستخدمين</h1>
          <p className="text-white/70">إدارة جميع المستخدمين في النظام</p>
        </div>
        <motion.button
          onClick={() => router.push('/admin/users/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>➕</span>
          <span>إضافة مستخدم جديد</span>
        </motion.button>
      </motion.div>

      {/* Users Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => router.push(`/admin/users/${user.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-white/70 text-sm">{user.email}</p>
                </div>
              </div>
              {getRoleBadge(user.role)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">تاريخ الإنشاء:</span>
                <span className="text-white text-sm">{formatDate(user.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">آخر تحديث:</span>
                <span className="text-white text-sm">{formatDate(user.updated_at)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/20">
              <motion.button
                onClick={(e) => { e.stopPropagation(); router.push(`/admin/users/${user.id}/edit`); }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تعديل
              </motion.button>
              <motion.button
                onClick={(e) => { e.stopPropagation(); handleDeleteClick(user); }}
                disabled={deleting === user.id}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {deleting === user.id ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري الحذف...</span>
                  </div>
                ) : (
                  'حذف'
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {users.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-white mb-2">لا يوجد مستخدمين</h3>
          <p className="text-white/70 mb-6">ابدأ بإضافة مستخدم جديد</p>
          <motion.button
            onClick={() => router.push('/admin/users/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة مستخدم جديد
          </motion.button>
        </motion.div>
      )}

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
