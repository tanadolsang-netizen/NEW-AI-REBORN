// Thai year-animal zodiac (ปีนักษัตร) — a 12-year cycle tied to the
// lunar new year, distinct from the 12 Western sun signs used elsewhere
// in this app. 2020-01-25–2021-02-11 was the most recent Rat (ชวด) year,
// so (year - 2020) mod 12 indexes into ANIMALS starting at Rat.
//
// Anyone born in January or early February should double check which
// side of Thai/Chinese lunar new year their birthday falls on — this
// uses the CE calendar year as a simple approximation, not the exact
// lunar boundary.

export type ThaiZodiacAnimal = {
  key: string;
  th: string;
  en: string;
  emoji: string;
  traitsTh: string;
  traitsEn: string;
};

export const THAI_ZODIAC_ANIMALS: ThaiZodiacAnimal[] = [
  {
    key: "rat",
    th: "ชวด",
    en: "Rat",
    emoji: "🐀",
    traitsTh: "ไหวพริบดี ปรับตัวเก่ง มองเห็นโอกาสก่อนใคร",
    traitsEn: "Sharp, adaptable, and quick to spot an opportunity.",
  },
  {
    key: "ox",
    th: "ฉลู",
    en: "Ox",
    emoji: "🐂",
    traitsTh: "มั่นคง อดทน ทำงานหนักและเชื่อถือได้",
    traitsEn: "Steady, patient, hardworking, and dependable.",
  },
  {
    key: "tiger",
    th: "ขาล",
    en: "Tiger",
    emoji: "🐅",
    traitsTh: "กล้าหาญ มีเสน่ห์ ชอบความท้าทาย",
    traitsEn: "Bold, magnetic, and drawn to a challenge.",
  },
  {
    key: "rabbit",
    th: "เถาะ",
    en: "Rabbit",
    emoji: "🐇",
    traitsTh: "ใจเย็น ละเอียดอ่อน รักความสงบ",
    traitsEn: "Gentle, careful, and peace-seeking.",
  },
  {
    key: "dragon",
    th: "มะโรง",
    en: "Dragon",
    emoji: "🐉",
    traitsTh: "มั่นใจ มีพลัง เป็นผู้นำโดยธรรมชาติ",
    traitsEn: "Confident, energetic, a natural-born leader.",
  },
  {
    key: "snake",
    th: "มะเส็ง",
    en: "Snake",
    emoji: "🐍",
    traitsTh: "ลึกซึ้ง ฉลาด วางแผนรอบคอบ",
    traitsEn: "Perceptive, intelligent, and a careful planner.",
  },
  {
    key: "horse",
    th: "มะเมีย",
    en: "Horse",
    emoji: "🐎",
    traitsTh: "อิสระ กระตือรือร้น รักการเดินทาง",
    traitsEn: "Independent, energetic, and always ready to travel.",
  },
  {
    key: "goat",
    th: "มะแม",
    en: "Goat",
    emoji: "🐐",
    traitsTh: "อ่อนโยน มีศิลปะ เห็นอกเห็นใจผู้อื่น",
    traitsEn: "Gentle, artistic, and empathetic.",
  },
  {
    key: "monkey",
    th: "วอก",
    en: "Monkey",
    emoji: "🐒",
    traitsTh: "ฉลาดไหวพริบ สนุกสนาน แก้ปัญหาเก่ง",
    traitsEn: "Clever, playful, and a natural problem-solver.",
  },
  {
    key: "rooster",
    th: "ระกา",
    en: "Rooster",
    emoji: "🐓",
    traitsTh: "ตรงไปตรงมา มั่นใจ ใส่ใจรายละเอียด",
    traitsEn: "Direct, confident, and detail-oriented.",
  },
  {
    key: "dog",
    th: "จอ",
    en: "Dog",
    emoji: "🐕",
    traitsTh: "ซื่อสัตย์ ยุติธรรม พึ่งพาได้เสมอ",
    traitsEn: "Loyal, fair, and always dependable.",
  },
  {
    key: "pig",
    th: "กุน",
    en: "Pig",
    emoji: "🐖",
    traitsTh: "ใจกว้าง ซื่อตรง ใช้ชีวิตอย่างเต็มที่",
    traitsEn: "Generous, honest, and full of good humor.",
  },
];

const RAT_YEAR_ANCHOR = 2020;

export function thaiZodiacForYear(ceYear: number): ThaiZodiacAnimal {
  const offset = ((ceYear - RAT_YEAR_ANCHOR) % 12 + 12) % 12;
  return THAI_ZODIAC_ANIMALS[offset];
}

export function buddhistYear(ceYear: number): number {
  return ceYear + 543;
}
