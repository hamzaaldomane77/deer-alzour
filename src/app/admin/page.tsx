'use client';

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // التأكد من أن المستخدم مسجل دخوله وله صلاحيات admin
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/user');
      return;
    }
  }, [user, router]);

  const handleLogout = () => {
    showToast({
      type: 'info',
      title: 'تم تسجيل الخروج',
      message: `وداعاً ${user?.name}، نراك قريباً!`,
      duration: 3000
    });
    
    setTimeout(() => {
      logout();
      router.push('/login');
    }, 1000);
  };

  const stats = [
    { title: "إجمالي المستخدمين", value: "1,234", icon: "👥", color: "from-blue-500 to-blue-600" },
    { title: "الطلبات المعلقة", value: "56", icon: "📋", color: "from-yellow-500 to-yellow-600" },
    { title: "الطلبات المكتملة", value: "890", icon: "✅", color: "from-green-500 to-green-600" },
    { title: "الإشعارات", value: "12", icon: "🔔", color: "from-red-500 to-red-600" },
  ];

  const recentActivities = [
    { action: "تم إنشاء مستخدم جديد", user: "أحمد محمد", time: "منذ 5 دقائق", type: "success" },
    { action: "تم تحديث الإعدادات", user: "سارة أحمد", time: "منذ 15 دقيقة", type: "info" },
    { action: "تم حذف طلب", user: "محمد علي", time: "منذ 30 دقيقة", type: "warning" },
    { action: "تم تسجيل دخول", user: "فاطمة حسن", time: "منذ ساعة", type: "success" },
  ];

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
    <div className="min-h-screen" style={{ backgroundColor: '#012623' }} dir="rtl">
      {/* Header */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">لوحة تحكم المدير</h1>
            <p className="text-green-300">مرحباً، {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">مرحباً بك في لوحة التحكم</h1>
          <p className="text-green-300 text-lg">نظام الإدارة - وزارة الداخلية السورية</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">الأنشطة الأخيرة</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-green-300 text-xs">{activity.user} - {activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "إضافة مستخدم", icon: "➕", color: "bg-blue-500", action: "تم فتح نموذج إضافة مستخدم" },
                { name: "إنشاء تقرير", icon: "📊", color: "bg-green-500", action: "تم بدء إنشاء التقرير" },
                { name: "إعدادات النظام", icon: "⚙️", color: "bg-yellow-500", action: "تم فتح إعدادات النظام" },
                { name: "النسخ الاحتياطي", icon: "💾", color: "bg-purple-500", action: "تم بدء عملية النسخ الاحتياطي" },
              ].map((action, index) => (
                <motion.button
                  key={action.name}
                  className={`${action.color} text-white p-4 rounded-lg hover:opacity-80 transition-opacity text-center`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    showToast({
                      type: 'info',
                      title: action.name,
                      message: action.action,
                      duration: 3000
                    });
                  }}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-sm font-medium">{action.name}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-white/70 text-sm">
            © 2024 وزارة الداخلية - الجمهورية العربية السورية | جميع الحقوق محفوظة
          </p>
        </motion.div>
      </div>
    </div>
  );
}