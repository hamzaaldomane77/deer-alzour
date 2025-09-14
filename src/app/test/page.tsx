export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          اختبار Tailwind CSS
        </h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-500 h-20 rounded"></div>
          <div className="bg-green-500 h-20 rounded"></div>
          <div className="bg-yellow-500 h-20 rounded"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">
          إذا رأيت الألوان والتصميم، فـ Tailwind يعمل بشكل صحيح!
        </p>
      </div>
    </div>
  );
}
