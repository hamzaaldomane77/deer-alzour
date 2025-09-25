'use client';

import { motion } from "framer-motion";
import { useState } from "react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { id: 1, name: "أحمد محمد علي", email: "ahmed@interior.gov.sy", role: "مدير", status: "نشط", lastLogin: "2024-01-15" },
    { id: 2, name: "سارة أحمد حسن", email: "sara@interior.gov.sy", role: "مشرف", status: "نشط", lastLogin: "2024-01-14" },
    { id: 3, name: "محمد علي إبراهيم", email: "mohammed@interior.gov.sy", role: "موظف", status: "غير نشط", lastLogin: "2024-01-10" },
    { id: 4, name: "فاطمة حسن محمد", email: "fatima@interior.gov.sy", role: "موظف", status: "نشط", lastLogin: "2024-01-15" },
    { id: 5, name: "علي أحمد محمود", email: "ali@interior.gov.sy", role: "مشرف", status: "نشط", lastLogin: "2024-01-13" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.includes(searchTerm) || user.email.includes(searchTerm)
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">إدارة المستخدمين</h1>
            <p className="text-green-300 text-lg">عرض وإدارة جميع المستخدمين في النظام</p>
          </div>
          <motion.button
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إضافة مستخدم جديد
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="البحث عن المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 text-right"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right">
              <option value="">جميع الأدوار</option>
              <option value="مدير">مدير</option>
              <option value="مشرف">مشرف</option>
              <option value="موظف">موظف</option>
            </select>
            <select className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right">
              <option value="">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="غير نشط">غير نشط</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-white font-medium">الاسم</th>
                <th className="px-6 py-4 text-white font-medium">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-white font-medium">الدور</th>
                <th className="px-6 py-4 text-white font-medium">الحالة</th>
                <th className="px-6 py-4 text-white font-medium">آخر دخول</th>
                <th className="px-6 py-4 text-white font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white text-right">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'مدير' ? 'bg-red-500/20 text-red-300' :
                      user.role === 'مشرف' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'نشط' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70 text-right">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                        ✏️
                      </button>
                      <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        🗑️
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      <motion.div 
        className="flex justify-center items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
          السابق
        </button>
        <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium">
          1
        </button>
        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
          2
        </button>
        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
          3
        </button>
        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
          التالي
        </button>
      </motion.div>
    </div>
  );
}
