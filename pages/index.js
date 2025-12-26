import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pazfzyooriwyzaphrcfc.supabase.co', 
  'sb_publishable_bK3Ere-XJklUE3RJmTAPqw_2gJUMBIP'
);

export default function BookingPage() {
  const [rounds, setRounds] = useState([]);
  const [userType, setUserType] = useState('general');
  const price = ['tg', 'wingspan', 'intern'].includes(userType) ? 375 : 750;

  useEffect(() => {
    const fetchRounds = async () => {
      const { data } = await supabase.from('exam_rounds').select('*').eq('is_active', true);
      setRounds(data || []);
    };
    fetchRounds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-blue-900 text-center mb-6">TG Exam Booking</h1>
        <div className="space-y-4">
          <label className="block text-sm font-bold">ประเภทผู้สมัคร</label>
          <select className="w-full p-3 border rounded-xl" value={userType} onChange={e => setUserType(e.target.value)}>
            <option value="tg">พนักงาน TG</option>
            <option value="wingspan">พนักงาน Wingspan</option>
            <option value="intern">นักศึกษาฝึกงาน</option>
            <option value="general">บุคคลภายนอก</option>
          </select>

          <label className="block text-sm font-bold">เลือกรอบสอบ</label>
          <select className="w-full p-3 border rounded-xl">
            <option>-- กรุณาเลือกรอบสอบ --</option>
            {rounds.map(r => (
              <option key={r.id}>{r.exam_date} ({r.exam_time})</option>
            ))}
          </select>

          <div className="p-4 bg-blue-50 rounded-2xl text-center">
            <p className="text-gray-600">ยอดชำระสุทธิ</p>
            <p className="text-3xl font-bold text-blue-600">{price} THB</p>
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg">ยืนยันการจอง</button>
        </div>
      </div>
    </div>
  );
}
