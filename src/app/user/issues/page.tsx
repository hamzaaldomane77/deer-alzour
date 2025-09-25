'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { IssueService } from '@/services/issueService';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Issue } from '@/types/issue';

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    issueId: number | null;
    issueTitle: string;
  }>({
    isOpen: false,
    issueId: null,
    issueTitle: ''
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
    fetchIssues();
  }, [user, isLoading, router]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await IssueService.getUserIssues();
      setIssues(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في تحميل القضايا',
        message: 'فشل في تحميل قائمة القضايا',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (issue: Issue) => {
    setConfirmDialog({
      isOpen: true,
      issueId: issue.id,
      issueTitle: issue.title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.issueId) return;

    try {
      setDeleting(confirmDialog.issueId);
      await IssueService.deleteIssue(confirmDialog.issueId);
      setIssues(issues.filter(issue => issue.id !== confirmDialog.issueId));
      showToast({
        type: 'success',
        title: 'تم الحذف بنجاح',
        message: 'تم حذف القضية بنجاح',
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'فشل في حذف القضية',
        duration: 5000
      });
    } finally {
      setDeleting(null);
      setConfirmDialog({
        isOpen: false,
        issueId: null,
        issueTitle: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({
      isOpen: false,
      issueId: null,
      issueTitle: ''
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
          <p>جاري تحميل القضايا...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">قضايا</h1>
            <p className="text-green-300 text-lg">إدارة قضاياك الشخصية</p>
          </div>
          <motion.button
            onClick={() => router.push('/user/issues/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة قضية جديدة
          </motion.button>
        </div>
      </motion.div>

      {/* Issues List */}
      {issues.length === 0 ? (
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد قضايا</h3>
          <p className="text-green-300 mb-6">لم تقم بإضافة أي قضايا بعد</p>
          <motion.button
            onClick={() => router.push('/user/issues/new')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة أول قضية
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue, index) => (
            <motion.div
              key={issue.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/user/issues/${issue.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">⚖️</div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/issues/${issue.id}/edit`);
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
                       handleDeleteClick(issue);
                     }}
                     disabled={deleting === issue.id}
                     className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                   >
                     {deleting === issue.id ? (
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                     ) : (
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     )}
                   </motion.button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{issue.title}</h3>
              <p className="text-green-300 text-sm mb-2">{issue.name}</p>
              <p className="text-white/80 text-sm mb-4 line-clamp-3">{issue.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-300">📅 {formatDate(issue.date)}</span>
                <span className="text-white/60">#{issue.id}</span>
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
         message={`هل أنت متأكد من حذف القضية "${confirmDialog.issueTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`}
         confirmText="حذف"
         cancelText="إلغاء"
         isLoading={deleting === confirmDialog.issueId}
         type="danger"
       />
     </div>
   );
 }
