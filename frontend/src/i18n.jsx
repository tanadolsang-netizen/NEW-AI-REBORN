'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  th: {
    brand: 'ASTRAL',
    nav: {
      home: 'หน้าแรก',
      dashboard: 'แดชบอร์ด',
      journal: 'บันทึกชีวิต',
      energy: 'พลังงานชีวิต',
      timing: 'จังหวะชีวิต',
      natal: 'ดวงเกิด',
      synastry: 'ปรัชญาความสัมพันธ์',
      transit: 'ดาวเคราะห์',
      branches: 'สาขาโหราศาสตร์',
      signin: 'เข้าสู่ระบบ',
      upgrade: 'อัปเกรด',
    },
    hero: {
      tag: 'โหราศาสตร์ที่เข้าใจชีวิต',
      title: 'อ่านดวง + จัดการชีวิตในที่เดียว',
      titleSub: 'คำนวณจากดาราศาสตร์ จริง',
      body: 'คำนวณตำแหน่งดาวเคราะห์อย่างแม่นยำ แบบออฟไลน์ ผสานกับคู่มือชีวิตประจำวัน',
      cta1: 'คำนวณดวงเกิด',
      cta2: 'เริ่มบันทึกชีวิต',
    },
    features: {
      title: 'ทำไมต้อง ASTRAL',
      subtitle: 'เครื่องมือโหราศาสตร์ที่คำนวณเอง ไม่ใช่แค่รวบรวมคำ — ต้องการความแม่นยำ',
      items: [
        { title: 'คำนวณดวงจริง', desc: 'คำนวณตำแหน่งดาวเคราะห์ออฟไลน์อย่างแม่นยำ' },
        { title: 'สองระบบในที่เดียว', desc: 'โหราศาสตร์ไทยและตะวันตก สมดุลกันอย่างเป็นธรรมชาติ' },
        { title: 'ดูแลบัญชีและข้อมูลส่วนตัว', desc: 'บันทึกการอ่านดวง รายการโน้ต และความเป็นส่วนตัว' },
        { title: 'ติดตามชีวิตและพลังงาน', desc: 'บันทึกประจำวัน + ดูพลังงานที่เหมาะกับแต่ละช่วงเวลา' },
        { title: 'ชำระเงินอย่างปลอดภัย', desc: 'อัปเกรดแผน Pro อย่างมั่นใจ' },
        { title: 'ใช้งานง่ายในมือถือ', desc: 'ออกแบบให้อ่านง่าย เร็ว และใช้งานได้ทุกสถานที่' },
      ],
    },
    natal: {
      title: 'บทสรุปดวงกำเนิด',
      body: 'กรอกเวลา/ที่เกิด → คำนวณตำแหน่งดาวเคราะห์จริง ณ เวลานั้น',
      demo: 'เติมข้อมูลตัวอย่าง',
      fields: [
        { key: 'date', label: 'วันเกิด (YYYY-MM-DD)', type: 'date' },
        { key: 'time', label: 'เวลาเกิด (HH:mm)', type: 'time' },
        { key: 'lat', label: 'ละติจูดสถานที่เกิด', type: 'number', step: '0.0001' },
        { key: 'lon', label: 'ลองจิจูดสถานที่เกิด', type: 'number', step: '0.0001' },
        { key: 'tz', label: 'เขตเวลา (+/- ชม.)', type: 'number', step: '1' },
        ],
        dateLabel: 'วันเกิด (YYYY-MM-DD)',
        timeLabel: 'เวลาเกิด (HH:mm)',
        latLabel: 'ละติจูดสถานที่เกิด',
        lonLabel: 'ลองจิจูดสถานที่เกิด',
        tzLabel: 'เขตเวลา (+/- ชม.)',
      submit: 'คำนวณดวง',
      loading: 'กำลังคำนวณ...',
      resultTitle: 'ผลลัพธ์',
      emptyTitle: '🌌',
      emptyBody: 'ใส่ข้อมูล แล้วกดคำนวณ',
    },
    branches: {
      title: 'สาขาโหราศาสตร์',
      subtitle: 'ภาพรวมสาขาหลัก + แหล่งอ้างอิงใน vault',
      search: 'ค้นหาสาขา...',
      count: 'รายการ',
      emptyIcon: '🕯️',
      emptyBody: 'ยังไม่มีข้อมูลสาขา',
      readMore: 'อ่านเพิ่มเติม',
    },
    transit: {
      title: 'ดาวเคราะห์ที่กำลังผ่าน',
      subtitle: 'ตำแหน่งดาวปัจจุบัน/ไกล',
      body: 'ดูตำแหน่งดาวปัจจุบัน พร้อมชาร์ตเกิดของคุณ',
    },
    dashboard: {
      greeting: 'สวัสดี, นักโหรจร',
      charts: 'ชาร์ตของฉัน',
      branches: 'สาขาที่ติดตาม',
      daily: 'ไทน์ไลน์วันนี้',
      recent: 'กิจกรรมล่าสุด',
      briefing: 'สรุปชีวิตยามเช้า',
      energyToday: 'พลังงานวันนี้',
      bestWindow: 'ช่วงเวลาดี',
      habitFocus: 'ภารกิจโฟกัส',
      title: 'Dashboard',
      subtitle: 'Morning Briefing + Life Tracking Hub',
    },
    journal: {
      title: 'บันทึกชีวิตประจำวัน',
      subtitle: 'บันทึกอารมณ์ ความเครียด การนอน และข้อคิด',
      mood: 'อารมณ์',
      stress: 'ความเครียด',
      sleep: 'ชั่วโมงนอน',
      note: 'บันทึกเพิ่มเติม',
      save: 'บันทึก',
      recent: 'บันทาล่าสุด',
      empty: 'ยังไม่มีบันทึก',
      moodLabels: ['ไม่กระตุก', 'แย่', 'กลาง', 'ดี', 'ดีมาก'],
      stressLabels: ['ผ่อนคลาย', 'สงบ', 'เล็กน้อย', 'ค่อนข้างเครียด', 'เครียดมาก'],
    },
    energy: {
      title: 'พยากรณ์พลังงานชีวิต',
      subtitle: 'พลังงาน inferred จากตำแหน่งดาว',
      primary: 'พลังงานหลักวันนี้',
      secondary: 'พลังงานรอง',
      hourly: 'จังหวะชั่วโมง',
      goodFor: 'เหมาะกับ',
      avoid: 'หลีกเลี่ยง',
      sun: 'พระอาทิตย์',
      moon: 'พระจันทร์',
      mercury: 'พุธ',
      venus: 'ศุกร์',
      mars: 'อังคาร',
      jupiter: 'พฤหัส',
      saturn: 'เสาร์',
    },
    timing: {
      title: 'Timing Sync',
      subtitle: 'เวลาที่ดีที่สุดตามจังหวะชีวิต',
      suggestion: 'คำแนะนำจังหวะวันนี้',
      routine: 'สมดุล Activities',
      priority: 'ลำดับความสำคัญ',
      morning: 'เช้า',
      midday: 'กลางวัน',
      afternoon: 'บ่าย',
      evening: 'เย็น',
      night: 'ค่ำ',
      importantUrgent: 'สำคัญ + ด่วน',
      importantNotUrgent: 'สำคัญ + ไม่ด่วน',
      urgentNotImportant: 'ด่วน + ไม่สำคัญ',
      doNow: 'ทำวันนี้',
      planLong: 'วางแผนระยะยาว',
      delegate: 'กระจาย / วิเคราะห์',
    },
    synastry: {
      title: 'Synastry',
      subtitle: 'วินิจฉัยภาพรวมความสัมพันธ์ ผ่าน cross-aspects',
      emptyTitle: '🔗',
      emptyBody: 'กรอกข้อมูลทั้งสองคน แล้วกดดูผล',
    },
    auth: {
      loginTitle: 'เข้าสู่ระบบ',
      signupTitle: 'สร้างบัญชี',
      login: 'เข้าสู่ระบบ',
      signup: 'สมัครสมาชิก',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      close: 'ปิด',
      noAccount: 'ยังไม่มีบัญชี?',
      hasAccount: 'มีบัญชีอยู่แล้ว?',
    },
    upgrade: {
      title: 'อัปเกรด ASTRAL',
      subtitle: 'ปลดล็อกฟีเจอร์ขั้นสูง สำหรับผู้ใช้งานทุกวัน',
      plan: 'Pro plan',
      price: '฿299/เดือน',
      cta: 'สมัครตอนนี้',
      monthly: 'รายเดือน',
      yearly: 'รายปี',
      subscribe: 'สมัครแผน',
    },
    common: {
      loading: 'กำลังโหลด...',
      readMore: 'อ่านเพิ่มเติม',
      rights: '© {year} ASTRAL. สงวนลิขสิทธิ์.',
      built: 'สร้างด้วย ❤️ และแรงบันดาลใจจากดารา',
    },
  },
  en: {
    brand: 'ASTRAL',
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      journal: 'Journal',
      energy: 'Energy',
      timing: 'Timing',
      natal: 'Natal',
      synastry: 'Synastry',
      transit: 'Transit',
      branches: 'Branches',
      signin: 'Sign in',
      upgrade: 'Upgrade',
    },
    hero: {
      tag: 'Astrology that understands your life',
      title: 'Read your chart + manage your days',
      titleSub: 'Precision from the stars',
      body: 'Accurate offline planetary calculations, paired with daily life guidance.',
      cta1: 'Calculate Natal',
      cta2: 'Start Journal',
    },
    features: {
      title: 'Why ASTRAL',
      subtitle: 'Astrology tools that calculate, not just aggregate. Precision-first.',
      items: [
        { title: 'Real ephemeris offline', desc: 'Offline planetary positions you can trust' },
        { title: 'Dual traditions', desc: 'Thai and Western astrology, balanced in one place' },
        { title: 'Private journaling', desc: 'Save readings, notes, and personal reflections' },
        { title: 'Daily rhythm tracking', desc: 'Journal your day and match it to cosmic timing' },
        { title: 'Transparent plans', desc: 'Simple Pro upgrade with secure payment' },
        { title: 'Mobile friendly', desc: 'Clean, readable design you can use anywhere' },
      ],
    },
    natal: {
      title: 'Natal Chart Summary',
      body: 'Enter birth data → calculate real planetary positions for that moment',
      demo: 'Fill demo data',
      fields: [
        { key: 'date', label: 'Birth date', type: 'date' },
        { key: 'time', label: 'Birth time', type: 'time' },
        { key: 'lat', label: 'Birthplace latitude', type: 'number', step: '0.0001' },
        { key: 'lon', label: 'Birthplace longitude', type: 'number', step: '0.0001' },
        { key: 'tz', label: 'Timezone offset', type: 'number', step: '1' },
      ],
      dateLabel: 'Birth date',
      timeLabel: 'Birth time',
      latLabel: 'Birthplace latitude',
      lonLabel: 'Birthplace longitude',
      tzLabel: 'Timezone offset',
      submit: 'Calculate',
      loading: 'Calculating...',
      resultTitle: 'Result',
      emptyTitle: '🌌',
      emptyBody: 'Enter data and press calculate',
    },
    branches: {
      title: 'Branches of Astrology',
      subtitle: 'Overview of major branches + vault references',
      search: 'Search branches...',
      count: 'items',
      emptyIcon: '🕯️',
      emptyBody: 'No branch data yet',
      readMore: 'Read more',
    },
    transit: {
      title: 'Current Transits',
      subtitle: 'Current / distant planetary positions',
      body: 'View current planetary positions alongside your natal chart',
    },
    dashboard: {
      greeting: 'Welcome back, stargazer',
      charts: 'My charts',
      branches: 'Followed branches',
      daily: "Today's timeline",
      recent: 'Recent activity',
    },
    synastry: {
      title: 'Synastry',
      subtitle: 'Relationship overview through cross-aspect analysis',
      emptyTitle: '🔗',
      emptyBody: 'Enter both charts and see results',
    },
    auth: {
      loginTitle: 'Sign in',
      signupTitle: 'Create account',
      signin: 'Sign in',
      signup: 'Sign up',
      email: 'Email',
      password: 'Password',
      close: 'Close',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
    },
    upgrade: {
      title: 'Upgrade ASTRAL',
      subtitle: 'Unlock advanced features for everyday use',
      plan: 'Pro plan',
      price: '$9/month',
      cta: 'Upgrade now',
    },
    common: {
      loading: 'Loading...',
      readMore: 'Read more',
    },
  },
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('astral-lang') || 'th');

  useEffect(() => {
    localStorage.setItem('astral-lang', lang);
  }, [lang]);

  const t = (key) => {
    const parts = key.split('.');
    let node = translations[lang];
    for (const p of parts) {
      if (node && typeof node === 'object') node = node[p];
      else return key;
    }
    return typeof node === 'string' ? node : key;
  };

  const toggle = () => setLang((l) => (l === 'th' ? 'en' : 'th'));

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
