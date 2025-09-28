'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import Image from 'next/image';

interface DocumentData {
  achievments: Array<{
    id: number;
    name: string;
    title: string;
    date: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  }>;
  issues: Array<{
    id: number;
    name: string;
    title: string;
    date: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  }>;
  tours: Array<{
    id: number;
    name: string;
    title: string;
    date: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  }>;
  visits: Array<{
    id: number;
    name: string;
    title: string;
    date: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  }>;
}

export default function ReportsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role === 'admin') {
      router.push('/admin');
      return;
    }
    fetchDocuments();
  }, [user, router]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:8000/api/user/documents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      showToast('خطأ في جلب البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل التقرير...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#012623' }}>
        <div className="text-white text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">خطأ في التحميل</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <motion.button
            onClick={fetchDocuments}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إعادة المحاولة
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#012623' }} dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/logo.png"
            alt="شعار الجمهورية العربية السورية"
            width={120}
            height={120}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-white mb-2">التقرير الشامل</h1>
          <p className="text-green-300 text-xl">الجمهورية العربية السورية - وزارة الداخلية</p>
          <p className="text-white/80 text-lg mt-2">
            تقرير شامل لجميع الأنشطة والإنجازات - {new Date().toLocaleDateString('ar-SA')}
          </p>
        </motion.div>

        {/* Report Content */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Achievements Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">🏆</span>
              الإنجازات ({documents?.achievments?.length || 0})
            </h2>
            
            {documents?.achievments && documents.achievments.length > 0 ? (
              <div className="grid gap-4">
                {documents.achievments.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                      <span className="text-green-300 text-sm bg-green-500/20 px-3 py-1 rounded-full">
                        {formatDate(achievement.date)}
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">
                      <span className="font-semibold text-green-300">الاسم:</span> {achievement.name}
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-white/60 text-lg">لا توجد إنجازات مسجلة</p>
              </div>
            )}
          </motion.div>

          {/* Issues Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">⚖️</span>
              القضايا ({documents?.issues?.length || 0})
            </h2>
            
            {documents?.issues && documents.issues.length > 0 ? (
              <div className="grid gap-4">
                {documents.issues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{issue.title}</h3>
                      <span className="text-blue-300 text-sm bg-blue-500/20 px-3 py-1 rounded-full">
                        {formatDate(issue.date)}
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">
                      <span className="font-semibold text-blue-300">الاسم:</span> {issue.name}
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">{issue.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-white/60 text-lg">لا توجد قضايا مسجلة</p>
              </div>
            )}
          </motion.div>

          {/* Tours Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">🗺️</span>
              الجولات الميدانية ({documents?.tours?.length || 0})
            </h2>
            
            {documents?.tours && documents.tours.length > 0 ? (
              <div className="grid gap-4">
                {documents.tours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{tour.title}</h3>
                      <span className="text-purple-300 text-sm bg-purple-500/20 px-3 py-1 rounded-full">
                        {formatDate(tour.date)}
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">
                      <span className="font-semibold text-purple-300">الاسم:</span> {tour.name}
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">{tour.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚶‍♂️</div>
                <p className="text-white/60 text-lg">لا توجد جولات ميدانية مسجلة</p>
              </div>
            )}
          </motion.div>

          {/* Visits Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">🏛️</span>
              الزيارات المدنية ({documents?.visits?.length || 0})
            </h2>
            
            {documents?.visits && documents.visits.length > 0 ? (
              <div className="grid gap-4">
                {documents.visits.map((visit, index) => (
                  <motion.div
                    key={visit.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{visit.title}</h3>
                      <span className="text-orange-300 text-sm bg-orange-500/20 px-3 py-1 rounded-full">
                        {formatDate(visit.date)}
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">
                      <span className="font-semibold text-orange-300">الاسم:</span> {visit.name}
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">{visit.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏢</div>
                <p className="text-white/60 text-lg">لا توجد زيارات مدنية مسجلة</p>
              </div>
            )}
          </motion.div>

          {/* Summary */}
          <motion.div
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">ملخص التقرير</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-300">{documents?.achievments?.length || 0}</div>
                <div className="text-white/80 text-sm">الإنجازات</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-300">{documents?.issues?.length || 0}</div>
                <div className="text-white/80 text-sm">القضايا</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-300">{documents?.tours?.length || 0}</div>
                <div className="text-white/80 text-sm">الجولات</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-300">{documents?.visits?.length || 0}</div>
                <div className="text-white/80 text-sm">الزيارات</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p>تم إنشاء هذا التقرير في {new Date().toLocaleDateString('ar-SA')} - وزارة الداخلية</p>
        </motion.div>
      </div>
    </div>
  );
}
