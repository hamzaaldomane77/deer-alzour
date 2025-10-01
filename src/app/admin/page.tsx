'use client';

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";

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


  // إذا لم يكن المستخدم مسجل دخوله أو لم يكن مدير، لا نعرض أي شيء
  // لأن useEffect سيتولى التوجيه مباشرة
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section with Logo */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/logo.png"
              alt="شعار الجمهورية العربية السورية"
              width={120}
              height={120}
              priority
              className="mx-auto mb-4"
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            مرحباً بك، {user?.name}!
          </motion.h1>
          
          <motion.p 
            className="text-red-300 text-xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            الجمهورية العربية السورية
          </motion.p>
          
          <motion.p 
            className="text-white/80 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            وزارة الداخلية - لوحة تحكم المدير
          </motion.p>
        </div>
      </motion.div>

      {/* Admin Notice */}
      <motion.div 
        className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-6 border border-red-400/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="text-4xl">🔐</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">صلاحيات المدير</h3>
            <p className="text-red-200 text-lg">
              لديك صلاحيات كاملة لإدارة النظام والتحكم في جميع الوظائف
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}