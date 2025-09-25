'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // توجيه المستخدم إذا كان مسجل دخوله بالفعل
  useEffect(() => {
    if (user && !isLoading) {
      // إظهار Toast ترحيبي
      showToast({
        type: 'success',
        title: `مرحباً ${user.name}!`,
        message: user.role === 'admin' 
          ? 'تم تسجيل دخولك كمدير بنجاح' 
          : 'تم تسجيل دخولك كمستخدم بنجاح',
        duration: 4000
      });

      // تأخير التوجيه قليلاً لإظهار Toast
      setTimeout(() => {
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      }, 1000);
    }
  }, [user, isLoading, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = await login(email, password);
    
    if (success) {
      // سيتم التوجيه تلقائياً في useEffect مع Toast ترحيبي
    } else {
      const errorMessage = "فشل في تسجيل الدخول. يرجى التحقق من البيانات المدخلة.";
      setError(errorMessage);
      
      // إظهار Toast خطأ
      showToast({
        type: 'error',
        title: 'خطأ في تسجيل الدخول',
        message: errorMessage,
        duration: 5000
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#012623' }} dir="rtl">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:flex items-center justify-between gap-32">
          {/* Left Side - Login Form */}
          <motion.div 
            className="flex-1 max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="  rounded-2xl p-8 "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-white text-center mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                تسجيل الدخول
              </motion.h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <label htmlFor="email" className="block text-sm text-right font-medium text-green-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    dir="ltr"
                    whileFocus={{ scale: 1.02, borderColor: "#fbbf24" }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <label htmlFor="password" className="block text-sm text-right font-medium text-green-300 mb-2">
                    كلمة المرور
                  </label>
                  <motion.input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="أدخل كلمة المرور"
                    required
                    dir="ltr"
                    whileFocus={{ scale: 1.02, borderColor: "#fbbf24" }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <motion.div 
                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          جاري تسجيل الدخول...
                        </div>
                      ) : (
                        "تسجيل الدخول"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <motion.a
                  href="#"
                  className="text-green-300 hover:text-yellow-400 transition-colors duration-300 text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  نسيت كلمة المرور؟
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Logo and Text */}
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Image
                src="/logo.png"
                alt="شعار الجمهورية العربية السورية"
                width={200}
                height={200}
                priority
                className="mb-6"
              />
              <motion.h1 
                className="text-3xl font-bold text-white mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                الجمهورية العربية السورية
              </motion.h1>
              
              <motion.p 
                className="text-white/80 text-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                وزارة الداخلية
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Layout - Single Column */}
        <motion.div 
          className="lg:hidden relative z-10 w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Mobile Logo and Text */}
          <motion.div 
            className="text-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative inline-block mb-4">
              <Image
                src="/logo.png"
                alt="شعار الجمهورية العربية السورية"
                width={100}
                height={100}
                priority
              />
            </div>
            <motion.h1 
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              الجمهورية العربية السورية
            </motion.h1>
            <motion.p 
              className="text-green-300 text-base pt-1 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Syrian Arab Republic
            </motion.p>
            <motion.p 
                className="text-white/80 text-lg pt-2 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                وزارة الداخلية
              </motion.p>
          </motion.div>

          {/* Mobile Login Form */}
          <motion.div 
            className=" p-8 "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-white text-center mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              تسجيل الدخول
            </motion.h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label htmlFor="email" className="block text-sm text-right font-medium text-green-300 mb-2">
                  البريد الإلكتروني
                </label>
                <motion.input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  dir="ltr"
                  whileFocus={{ scale: 1.02, borderColor: "#fbbf24" }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <label htmlFor="password" className="block text-sm text-right font-medium text-green-300 mb-2">
                  كلمة المرور
                </label>
                <motion.input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                  placeholder="أدخل كلمة المرور"
                  required
                  dir="ltr"
                  whileFocus={{ scale: 1.02, borderColor: "#fbbf24" }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <motion.div 
                          className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        جاري تسجيل الدخول...
                      </div>
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <motion.a
                href="#"
                className="text-green-300 hover:text-yellow-400 transition-colors duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
              >
                نسيت كلمة المرور؟
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* Footer - معلومات إضافية */}
      <motion.div 
        className="text-center py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.p 
          className="text-white/70 text-sm"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          © 2024 وزارة الداخلية - الجمهورية العربية السورية
        </motion.p>
      </motion.div>
    </div>
  );
}
