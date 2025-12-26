import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. ส่วนเชื่อมต่อ Database (วางไว้บนสุดนอกฟังก์ชัน)
const supabase = createClient(
  'https://pazfzyooriwyzaphrcfc.supabase.co', 
  'sb_publishable_bK3Ere-XJklUE3RJmTAPqw_2gJUMBIP'
);

export default function BookingPage() {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [userType, setUserType] = useState('general');
  const [payMethod, setPayMethod] = useState('transfer');
  const [loading, setLoading] = useState(false);

  // 2. ดึงข้อมูลรอบสอบจาก Database
  useEffect(() => {
    const fetchRounds = async () => {
      const { data } = await supabase
        .from('exam_rounds')
        .select('*')
        .eq('is_active', true)
        .order('exam_date', { ascending: true });
      setRounds(data || []);
    };
    fetchRounds();
  }, []);

  // 3. คำนวณราคาตามเงื่อนไข (TG, Wingspan, Intern = 375 | General = 750)
  const isInternal = ['tg', 'wingspan', 'intern'].includes(userType);
  const price = isInternal ? 375 : 750;

  // 4. ฟังก์ชันส่งข้อมูลการจอง
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedRound) {
      alert("กรุณาเลือกรอบสอบ");
      setLoading(false);
      return;
    }

    // เช็คที่นั่งว่างก่อนกดจอง
    const { data: round } = await supabase
      .from('exam_rounds')
      .select('current_seats')
      .eq('id', selectedRound)
      .single();

    if (round.current_seats >= 70) {
      alert("ขออภัย รอบนี้เต็มแล้วครับ");
      setLoading(false);
      return;
    }

    // บันทึกข้อมูลลงตาราง bookings
    // (ในขั้นตอนนี้ ถ้าคุณต้องการอัปโหลดไฟล์จริงๆ ต้องเขียนโค้ด Storage เพิ่ม)
    // สำหรับตอนนี้เราจะทำ Logic พื้นฐานให้ทำงานได้ก่อน
    alert("ระบบได้รับข้อมูลการจองของท่านแล้ว (ขั้นตอนนี้รอเชื่อมต่อระบบอัปโหลดไฟล์สมบูรณ์)");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">จองที่นั่งสอบ</h1>

        <form onSubmit={handleBooking} className="space-y-4">
          {/* ประเภทผู้สมัคร */}
          <div>
            <label className="block text-sm font-medium mb-1">ประเภทผู้สมัคร</label>
            <select 
              className="w-full p-2 border rounded-lg bg-white"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="tg">พนักงานการบินไทย (TG Staff)</option>
              <option value="wingspan">พนักงาน Outsource (Wingspan)</option>
              <option value="intern">นักศึกษาฝึกงาน (Internship)</option>
              <option value="general">บุคคลภายนอก (General Public)</option>
            </select>
          </div>

          {/* เลือกรอบสอบ */}
          <div>
            <label className="block text-sm font-medium mb-1">เลือกรอบสอบ (จำกัด 70 ที่/รอบ)</label>
            <select 
              className="w-full p-2 border rounded-lg bg-white"
              onChange={(e) => setSelectedRound(e.target.value)}
              required
            >
              <option value="">-- กรุณาเลือกรอบ --</option>
              {rounds.map(r => (
                <option key={r.id} value={r.id} disabled={r.current_seats >= 70}>
                  {r.exam_date} ({r.exam_time === 'Morning' ? 'เช้า' : 'บ่าย'}) - ว่าง {70 - r.current_seats} ที่
                </option>
              ))}
            </select>
          </div>

          {/* แสดงราคา Net */}
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <span className="text-gray-600">ยอดชำระสุทธิ:</span>
            <div className="text-2xl font-bold text-blue-600">{price} บาท</div>
          </div>

          {/* แนบบัตรพนักงาน (เฉพาะคนใน) */}
          {isInternal && (
            <div className="border-l-4 border-orange-500 bg-orange-50 p-3">
              <label className="block text-sm font-bold text-orange-700">แนบรูปบัตรพนักงาน / นักศึกษา</label>
              <input type="file" className="mt-1 text-sm w-full" required />
            </div>
          )}

          {/* วิธีชำระเงิน */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">ช่องทางการชำระเงิน</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pay" value="transfer" checked={payMethod === 'transfer'} onChange={() => setPayMethod('transfer')} /> โอนเงิน
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pay" value="walkin" onChange={() => setPayMethod('walkin')} /> จ่ายหน้างาน
              </label>
            </div>
          </div>

          {/* ส่วนการโอนเงิน */}
          {payMethod === 'transfer' && (
            <div className="p-4 border rounded-xl bg-gray-50 text-center space-y-3">
              <p className="text-xs text-gray-500 font-bold">สแกน QR เพื่อโอนเงิน {price} บาท</p>
              <div className="bg-white p-2 inline-block rounded-lg shadow-sm">
                {/* ใส่ URL รูป QR Code ของคุณตรงนี้ */}
                <img src="https://via.placeholder.com/150?text=PromptPay+QR" alt="QR PromptPay" className="mx-auto" />
              </div>
              <label className="block text-xs font-medium text-gray-700">แนบสลิปการโอน</label>
              <input type="file" className="text-sm mx-auto block w-full" required />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition disabled:bg-gray-400"
          >
            {loading ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการจองที่นั่ง'}
          </button>
        </form>
      </div>
    </div>
  );
}
