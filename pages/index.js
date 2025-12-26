import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// เชื่อมต่อฐานข้อมูล
const supabase = createClient(
  'https://pazfzyooriwyzaphrcfc.supabase.co', 
  'sb_publishable_bK3Ere-XJklUE3RJmTAPqw_2gJUMBIP'
);

export default function BookingPage() {
  const [rounds, setRounds] = useState([]);
  const [userType, setUserType] = useState('general');

  // คำนวณราคา
  const price = ['tg', 'wingspan', 'intern'].includes(userType) ? 375 : 750;

  // ดึงข้อมูลวันสอบ
  useEffect(() => {
    async function getRounds() {
      const { data } = await supabase.from('exam_rounds').select('*').eq('is_active', true);
      setRounds(data || []);
    }
    getRounds();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>ระบบจองที่นั่งสอบ</h2>
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>ประเภทผู้สมัคร</label>
        <select 
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="tg">พนักงาน TG</option>
          <option value="wingspan">พนักงาน Wingspan</option>
          <option value="intern">นักศึกษาฝึกงาน</option>
          <option value="general">บุคคลภายนอก</option>
        </select>

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>เลือกรอบสอบ</label>
        <select style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <option value="">-- กรุณาเลือกรอบสอบ --</option>
          {rounds.map(r => (
            <option key={r.id} value={r.id}>{r.exam_date} ({r.exam_time})</option>
          ))}
        </select>

        <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>ค่าธรรมเนียม:</span>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{price} บาท</div>
        </div>

        <button 
          style={{ width: '100%', padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => alert('ระบบบันทึกข้อมูลกำลังจะมาเร็วๆ นี้!')}
        >
          ยืนยันการจอง
        </button>
      </div>
    </div>
  );
}
