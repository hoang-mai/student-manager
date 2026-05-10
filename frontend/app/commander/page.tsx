import React from 'react';
import AnimatedContainer from '@/library/AnimatedContainer';

export default function CommanderDashboard() {
  return (
    <AnimatedContainer variant="slideUp" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-800">Tổng quan hệ thống</h1>
        <p className="text-neutral-500 mt-2">Chào mừng Chỉ huy quay trở lại. Dưới đây là tóm tắt tình hình đơn vị.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder cards for statistics */}
        {[
          { label: 'Tổng số học viên', value: '120', color: 'bg-primary-50 text-primary-700' },
          { label: 'Đề xuất chờ duyệt', value: '08', color: 'bg-secondary-50 text-secondary-700' },
          { label: 'Học viên trực hôm nay', value: '04', color: 'bg-tertiary-50 text-tertiary-700' },
          { label: 'Cảnh báo học phí', value: '02', color: 'bg-error-50 text-error-700' },
        ].map((card, index) => (
          <div key={index} className={`p-6 rounded-2xl border border-neutral-100 shadow-sm bg-white hover:shadow-md transition-shadow`}>
            <p className="text-sm font-medium text-neutral-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-2 ${card.color.split(' ')[1]}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm min-h-[300px] flex items-center justify-center text-neutral-400 italic">
        Các biểu đồ thống kê và thông tin chi tiết sẽ được hiển thị tại đây...
      </div>
    </AnimatedContainer>
  );
}
