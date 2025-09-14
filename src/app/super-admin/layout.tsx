'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "لوحة التحكم", icon: "📊", href: "/super-admin" },
    { name: "المستخدمين", icon: "👥", href: "/super-admin/users" },
    { name: "الإعدادات", icon: "⚙️", href: "/super-admin/settings" },
    { name: "التقارير", icon: "📈", href: "/super-admin/reports" },
    { name: "الأمان", icon: "🔒", href: "/super-admin/security" },
    { name: "النسخ الاحتياطي", icon: "💾", href: "/super-admin/backup" },
  ];

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
          <div className="flex  justify-between items-center h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-8">
              <Image
                src="/logo.png"
                alt="شعار الجمهورية العربية السورية"
                width={70}
                height={70}
                
              />
              <div className="text-right hidden sm:block p-2">
                <h1 className="text-xl font-bold text-white">نظام الإدارة </h1>
                <p className="text-green-300 text-sm">الجمهورية العربية السورية</p>
              </div>
            </div>
            
            {/* Mobile Title */}
            <div className="text-center sm:hidden">
              <h1 className="text-lg font-bold text-white">نظام الإدارة </h1>
              <p className="text-green-300 text-sm">الجمهورية العربية السورية</p>
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

            {/* Desktop Sidebar Toggle Button */}
           

            {/* User info */}
            <div className="hidden md:flex items-center space-x-8">
            <div className="w-10 h-10  bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">أ</span>
              </div>
              <div className="text-right pr-4">
                <p className="text-white font-medium">المدير العام</p>
                <p className="text-green-300 text-sm">admin@interior.gov.sy</p>
              </div>
             
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Desktop Sidebar - Always Visible */}
        <motion.aside 
          className="hidden md:block w-80 bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Sidebar Header */}
         
          
          {/* Navigation Menu */}
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
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <span className="font-medium text-lg">{item.name}</span>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🔒</span>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">اتصال آمن</p>
                <p className="text-green-300 text-sm">مشفر 256-bit</p>
              </div>
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
              className="fixed inset-y-0 right-0 z-50 w-80 bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-2xl md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">القائمة الرئيسية</h2>
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
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🔒</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">اتصال آمن</p>
                    <p className="text-green-300 text-sm">مشفر 256-bit</p>
                  </div>
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
