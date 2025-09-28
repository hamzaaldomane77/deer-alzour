'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // التأكد من أن المستخدم مسجل دخوله وله صلاحيات admin
  useEffect(() => {
    // انتظار انتهاء التحميل أولاً
    if (isLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/user');
      return;
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { name: "لوحة التحكم", icon: "📊", href: "/admin" },
    { name: "المستخدمين", icon: "👥", href: "/admin/users" },
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
      <motion.header 
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-8">
              <motion.div
                onClick={() => router.push('/admin')}
                className="cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/logo.png"
                  alt="شعار الجمهورية العربية السورية"
                  width={70}
                  height={70}
                />
              </motion.div>
              <div className="text-right hidden sm:block p-2">
                <h1 className="text-xl font-bold text-white">لوحة تحكم المدير</h1>
                <p className="text-red-300 text-sm">الجمهورية العربية السورية</p>
              </div>
            </div>
            
            {/* Mobile Title */}
            <div className="text-center sm:hidden">
              <h1 className="text-lg font-bold text-white">لوحة تحكم المدير</h1>
              <p className="text-red-300 text-sm">الجمهورية العربية السورية</p>
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-3 rounded-lg text-white hover:bg-white/10 transition-colors border border-white/20 bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

            
            <div className="hidden md:flex items-center space-x-8">
              {user && (
                <>
                  <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <div className="text-right pr-4">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-red-300 text-sm truncate max-w-32" title={user.email}>
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    تسجيل الخروج
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Desktop Sidebar - Always Visible */}
        <motion.aside 
          className="hidden md:block w-80 h-screen bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Sidebar Header */}
        
          
          {/* Navigation Menu */}
          <div className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-4 p-4 rounded-xl text-white hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <span className="font-medium text-lg">{item.name}</span>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-white/60 text-xs">نظام الإدارة</p>
              <p className="text-red-300 text-xs">وزارة الداخلية</p>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Sidebar - Toggleable */}
        {sidebarOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Mobile Sidebar Panel */}
            <motion.aside 
              className="fixed inset-0 right-0 z-50 w-96 h-screen bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-2xl md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">🔐</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">لوحة الإدارة</h2>
                </div>
                <motion.button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Mobile Navigation Menu */}
              <div className="p-6">
                <nav className="space-y-3">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-4 p-4 rounded-xl text-white hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      <span className="font-medium text-lg">{item.name}</span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Mobile Sidebar Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
                <div className="text-center">
                  <p className="text-white/60 text-xs">نظام الإدارة</p>
                  <p className="text-red-300 text-xs">وزارة الداخلية</p>
                </div>
              </div>
            </motion.aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-0">
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

    </div>
  );
}
