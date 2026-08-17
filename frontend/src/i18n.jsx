'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  th: {
    brand: 'ASTRAL',
    nav: {
      home: 'หน้าแรก',
      natal: 'ดวงเกิด',
      transit: 'ดาวเคราะห์ movements',
      branches: 'สาขาโหราศาสตร์',
    },
    hero: {
      tag: 'โหราศาสตร์อัจฉริยะ',
      title: 'คำนวณดวงด้วยเลข heavenly ลネจ',
      titleSub: 'ความแม่นยำจากดาราศาสตร์',
      body: 'ระบบคำนวณ ephemeris offline แบบ standalone ไม่พึ่ง API ภายนอก พร้อมสาขาวิชาที่ครอบคลุม',
      cta1: 'คำนวณดวงเกิด',
      cta2: 'เรียนรู้สาขาต่างๆ',
    },
    features: {
      title: 'ทำไมต้อง ASTRAL',
      subtitle: 'เครื่องมือโหราศาสตร์ที่คำนวณเอง ไม่ใช่แค่รวบรวมคำ — ต้องการความแม่นยำ',
      items: [
        { title: 'Ephemeris จริง offline', desc: 'คำนวณตำแหน่งดาวเคราะห์ด้วย JPL DE421 + skyfield แบบ standalone' },
        { title: 'สองระบบ: ไทย + Western', desc: 'รองรับทั้งโหราศาสตร์ไทยและตะวันตกในระบบเดียว' },
        { title: 'FastAPI backend', desc: 'scripts ใน vault wrap เป็น REST API พร้อม validation + error handling' },
        { title: 'React frontend', desc: 'ออกแบบ Apple-style พร้อม 3D, GSAP animations, responsive design' },
        { title: 'Supabase auth', desc: 'จัดการผู้ใช้ + การสมัครสมาชิก + บันทึกข้อมูลส่วนตัว' },
        { title: 'Stripe payments', desc: 'ระบบชำระเงินสำหรับ subscription และ in-app purchases' },
      ],
    },
    natal: {
      title: 'บทสรุปดวงกำเนิด',
      body: 'กรอกเวลา/ที่เกิด → ระบบคำนวณตำแหน่งดาวเคราะห์จริง ณ เวลานั้น',
      demo: 'เติมข้อมูลตัวอย่าง',
      fields: [
        { key: 'date', label: 'วันเกิด (YYYY-MM-DD)', type: 'date' },
        { key: 'time', label: 'เวลาเกิด (HH:mm)', type: 'time' },
        { key: 'lat', label: 'ละติจูด birthplace', type: 'number', step: '0.0001' },
        { key: 'lon', label: 'ลองจิจูด birthplace', type: 'number', step: '0.0001' },
        { key: 'tz', label: 'Timezone (+/- hours)', type: 'number', step: '1' },
      ],
      dateLabel: 'วันเกิด (YYYY-MM-DD)',
      timeLabel: 'เวลาเกิด (HH:mm)',
      latLabel: 'ละติจูด birthplace',
      lonLabel: 'ลองจิจูด birthplace',
      tzLabel: 'Timezone (+/- hours)',
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
    footer: {
      rights: '© {year} ASTRAL. สงวนลิขสิทธิ์.',
      built: 'สร้างด้วย ❤️ สำหรับผู้ propelled ด้วยดาว',
      loading: 'กำลังโหลด...',
    },
    common: {
      loading: 'กำลังโหลด...',
      readMore: 'อ่านเพิ่มเติม',
    },
  },
  en: {
    brand: 'ASTRAL',
    nav: {
      home: 'Home',
      natal: 'Natal',
      transit: 'Transit',
      branches: 'Branches',
    },
    hero: {
      tag: 'Astrology Intelligence',
      title: 'Calculate your chart with heavenly precision',
      titleSub: 'Precision from the stars',
      body: 'Offline-first ephemeris engine. No external APIs. Complete astrological branches in one place.',
      cta1: 'Calculate Natal',
      cta2: 'Explore Branches',
    },
    features: {
      title: 'Why ASTRAL',
      subtitle: 'Astrology tools that calculate, not just aggregate. Precision-first.',
      items: [
        { title: 'Real ephemeris offline', desc: 'JPL DE421 + skyfield standalone calculations' },
        { title: 'Dual systems: Thai + Western', desc: 'Support both Thai astrology and Western traditions simultaneously' },
        { title: 'FastAPI backend', desc: 'Vault scripts wrapped as REST API with validation' },
        { title: 'React frontend', desc: 'Apple-style design with 3D, GSAP animations, responsive' },
        { title: 'Supabase auth', desc: 'User management with secure authentication' },
        { title: 'Stripe payments', desc: 'Subscription and in-app purchase system' },
      ],
    },
    natal: {
      title: 'Natal Chart Summary',
      body: 'Enter birth data → system calculates real planetary positions',
      demo: 'Fill demo data',
      fields: [
        { key: 'date', label: 'Birth date (YYYY-MM-DD)', type: 'date' },
        { key: 'time', label: 'Birth time (HH:mm)', type: 'time' },
        { key: 'lat', label: 'Birthplace latitude', type: 'number', step: '0.0001' },
        { key: 'lon', label: 'Birthplace longitude', type: 'number', step: '0.0001' },
        { key: 'tz', label: 'Timezone (+/- hours)', type: 'number', step: '1' },
      ],
      dateLabel: 'Birth date (YYYY-MM-DD)',
      timeLabel: 'Birth time (HH:mm)',
      latLabel: 'Birthplace latitude',
      lonLabel: 'Birthplace longitude',
      tzLabel: 'Timezone (+/- hours)',
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
    footer: {
      rights: '© {year} ASTRAL. All rights reserved.',
      built: 'Built with ❤️ for astrology enthusiasts',
      loading: 'Loading...',
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
