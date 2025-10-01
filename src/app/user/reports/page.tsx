'use client';

import { useState, useEffect, useRef } from 'react';
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
  const reportRef = useRef<HTMLDivElement>(null);

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
      
      // استخدام apiClient الذي يحتوي على منطق التحديث التلقائي
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
      showToast({
        type: 'error',
        title: 'خطأ في جلب البيانات',
        message: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
        duration: 5000
      });
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

  // دالة الطباعة
  const handlePrint = () => {
    if (!reportRef.current) return;
    
    // إنشاء نافذة طباعة جديدة
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // الحصول على محتوى الوثيقة مع الحفاظ على التنسيق
    const documentContent = reportRef.current.innerHTML;
    
    // إنشاء HTML كامل للطباعة مع تنسيق مطابق للعرض
    const printHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>التقرير الشهري</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, Tahoma, sans-serif;
            direction: rtl;
            text-align: right;
            background: white;
            color: black;
            line-height: 1.6;
          }
          
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          
          /* تنسيق الهيدر */
          .flex {
            display: flex;
          }
          
          .justify-between {
            justify-content: space-between;
          }
          
          .items-start {
            align-items: flex-start;
          }
          
          .mb-8 {
            margin-bottom: 2rem;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-left {
            text-align: left;
          }
          
          .text-lg {
            font-size: 1.125rem;
          }
          
          .font-semibold {
            font-weight: 600;
          }
          
          .flex-shrink-0 {
            flex-shrink: 0;
          }
          
          .mx-8 {
            margin-left: 2rem;
            margin-right: 2rem;
          }
          
          /* تنسيق العنوان الرئيسي */
          .text-center {
            text-align: center;
          }
          
          .text-3xl {
            font-size: 1.875rem;
          }
          
          .font-bold {
            font-weight: 700;
          }
          
          .pl-20 {
            padding-left: 5rem;
          }
          
          /* تنسيق المحتوى */
          .text-black {
            color: black;
          }
          
          .text-lg {
            font-size: 1.125rem;
          }
          
          .leading-relaxed {
            line-height: 1.625;
          }
          
          .mb-6 {
            margin-bottom: 1.5rem;
          }
          
          .mb-2 {
            margin-bottom: 0.5rem;
          }
          
          .mb-4 {
            margin-bottom: 1rem;
          }
          
          .mb-3 {
            margin-bottom: 0.75rem;
          }
          
          .mb-8 {
            margin-bottom: 2rem;
          }
          
          /* تنسيق الأقسام */
          .text-blue-800 {
            color: #1e40af;
          }
          
          .font-semibold {
            font-weight: 600;
          }
          
          .mr-6 {
            margin-right: 1.5rem;
          }
          
          .text-sm {
            font-size: 0.875rem;
          }
          
          .mt-1 {
            margin-top: 0.25rem;
          }
          
          /* تنسيق الفوتر */
          .mt-12 {
            margin-top: 3rem;
          }
          
          .pl-16 {
            padding-left: 4rem;
          }
          
          /* تنسيق الصور */
          img {
            max-width: 120px;
            height: auto;
            display: block;
          }
          
          .mx-auto {
            margin-left: auto;
            margin-right: auto;
          }
          
          /* تنسيق الطباعة */
          @media print {
            body {
              margin: 0;
              padding: 0;
              background: white !important;
            }
            
            .print-container {
              max-width: none;
              margin: 0;
              padding: 20px;
            }
            
            @page {
              margin: 1cm;
              size: A4;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${documentContent}
        </div>
      </body>
      </html>
    `;
    
    // كتابة المحتوى في النافذة الجديدة
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // انتظار تحميل الصور ثم الطباعة
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    };
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4 text-black">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDocuments}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS للطباعة */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .print-container {
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>
      
      <div className="min-h-screen max-w-5xl mx-auto bg-white" dir="rtl">

      <div className="max-w-4xl mx-auto p-8 print-container" ref={reportRef}>
        {/* Document Header */}
        <div className="flex justify-between items-start mb-8">
          {/* English Text - Left */}
        
          <div className="text-right text-black">
            <div className="text-lg font-semibold">الجمهورية العربية السورية</div>
            <div className="text-lg font-semibold">وزارة الداخلية</div>
            <div className="text-lg font-semibold">قيادة الأمن الداخلي بدير الزور</div>
            <div className="text-lg font-semibold mt-2">{user?.name}</div>
          </div>
          
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="شعار الجمهورية العربية السورية"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>

          {/* Arabic Text - Right */}
          <div className="text-left text-black">
            <div className="text-lg font-semibold">Syrian Arab Republic</div>
            <div className="text-lg font-semibold">Ministry of Interior</div>
            <div className="text-lg font-semibold">Internal Security Command</div>
            <div className="text-lg font-semibold"> Deir ez-Zor</div>
          </div>
        
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black pl-10">التقرير الشهري</h1>
        </div>

        {/* Report Body */}
        <div className="text-black text-lg leading-relaxed">
          {/* Introduction */}
          <div className="mb-6">
            <div className="mb-2">السيد مسؤول الإدارة العامة</div>
            <div className="mb-4">نرفع لحاشيتكم التقرير الشهري (الأنجازات) ويتضمن :</div>
          </div>

          {/* Achievements Section */}
          <div className="mb-4">
            <div className="text-blue-800 font-semibold mb-2">- الإنجازات الخاصة بهذا الشهر :</div>
            {documents?.achievments && documents.achievments.length > 0 ? (
              <div className="mr-6">
                {documents.achievments.map((achievement, index) => (
                  <div key={achievement.id} className="mb-3">
                    <div className="text-sm">
                      • قام الأخ {achievement.name} الملقب ب{achievement.title} ب{achievement.description}
                    </div>
                    <div className="text-sm text-left mt-1">
                      وذلك بتاريخ {achievement.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mr-6">لا يوجد إنجازات لهذا الشهر</div>
            )}
          </div>

          {/* Issues Section */}
          <div className="mb-4">
            <div className="text-blue-800 font-semibold mb-2">- المتابعات الخاصة بهذا الشهر :</div>
            {documents?.issues && documents.issues.length > 0 ? (
              <div className="mr-6">
                {documents.issues.map((issue, index) => (
                  <div key={issue.id} className="mb-3">
                    <div className="text-sm">
                      • قام الأخ {issue.name} الملقب ب{issue.title} ب{issue.description}
                    </div>
                    <div className="text-sm text-left mt-1">
                      وذلك بتاريخ {issue.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mr-6">لا يوجد متابعات لهذا الشهر</div>
            )}
          </div>

          {/* Tours Section */}
          <div className="mb-4">
            <div className="text-blue-800 font-semibold mb-2">- الجولات الميدانية الخاصة بهذا الشهر :</div>
            {documents?.tours && documents.tours.length > 0 ? (
              <div className="mr-6">
                {documents.tours.map((tour, index) => (
                  <div key={tour.id} className="mb-3">
                    <div className="text-sm">
                      • قام الأخ {tour.name} الملقب ب{tour.title} ب{tour.description}
                    </div>
                    <div className="text-sm text-left mt-1">
                      وذلك بتاريخ {tour.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mr-6">لا يوجد جولات ميدانية لهذا الشهر</div>
            )}
          </div>

          {/* Visits Section */}
          <div className="mb-8">
            <div className="text-blue-800 font-semibold mb-2">- الزيارات المدنية الخاصة بهذا الشهر :</div>
            {documents?.visits && documents.visits.length > 0 ? (
              <div className="mr-6">
                {documents.visits.map((visit, index) => (
                  <div key={visit.id} className="mb-3">
                    <div className="text-sm">
                      • قام الأخ {visit.name} الملقب ب{visit.title} ب{visit.description}
                    </div>
                    <div className="text-sm text-left mt-1">
                      وذلك بتاريخ {visit.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mr-6">لا يوجد زيارات مدنية لهذا الشهر</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-left text-black mt-12">
          <div className="mb-2">دير الزور في: {new Date().toLocaleDateString('en-GB')}</div>
          <div className='pl-16'>{user?.name}</div>
        </div>
      </div>

      {/* أزرار التحكم - خارج الوثيقة تماماً */}
      <div className=" py-8 no-print">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex justify-center">
            <button
              id="print-button"
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-3 rtl:space-x-reverse transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="font-semibold text-lg">طباعة التقرير</span>
            </button>
          </div>
          
          {/* معلومات إضافية */}
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>يمكنك طباعة التقرير مباشرة</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
