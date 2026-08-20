"""Tarot deck data and spread-drawing logic.

Mirrors the knowledge base at raw/tarot/*.md: major-arcana.md for
MAJOR_ARCANA, minor-arcana.md for the suit/rank meanings that generate
MINOR_ARCANA, and spreads.md for SPREADS. Keep those three in sync if this
data changes.
"""

import hashlib
import random

# --- Major Arcana (raw/tarot/major-arcana.md) ---------------------------

MAJOR_ARCANA: list[dict] = [
    {"name": "The Fool", "upright": "การเริ่มต้นใหม่ ความไร้เดียงสา ก้าวกระโดดด้วยศรัทธา",
     "reversed": "ประมาท ไม่คิดก่อนทำ เสี่ยงเกินจำเป็น"},
    {"name": "The Magician", "upright": "พลังสร้างสรรค์ ความสามารถ การลงมือทำให้เป็นจริง",
     "reversed": "ใช้ความสามารถผิดทาง หลอกตัวเอง"},
    {"name": "The High Priestess", "upright": "สัญชาตญาณ ความลับ ปัญญาภายใน",
     "reversed": "ปิดกั้นสัญชาตญาณตัวเอง ข้อมูลไม่ครบ"},
    {"name": "The Empress", "upright": "ความอุดมสมบูรณ์ การเติบโต ความรักความเอื้ออาทร",
     "reversed": "พึ่งพาเกินไป ละเลยตัวเอง"},
    {"name": "The Emperor", "upright": "โครงสร้าง อำนาจ ความมั่นคง",
     "reversed": "เผด็จการ ยึดติดการควบคุม"},
    {"name": "The Hierophant", "upright": "ประเพณี การเรียนรู้จากระบบ ที่ปรึกษา",
     "reversed": "กบฏต่อกฎเกณฑ์ ท้าทายขนบ"},
    {"name": "The Lovers", "upright": "ทางเลือกจากใจ ความสัมพันธ์ ความสอดคล้องกับคุณค่าตัวเอง",
     "reversed": "ความสัมพันธ์ไม่สมดุล ตัดสินใจผิด"},
    {"name": "The Chariot", "upright": "ความมุ่งมั่น ชัยชนะจากวินัย ควบคุมทิศทางตัวเอง",
     "reversed": "สูญเสียทิศทาง ขาดการควบคุม"},
    {"name": "Strength", "upright": "ความอดทนอ่อนโยน กล้าหาญจากภายใน",
     "reversed": "สงสัยในตัวเอง ใช้กำลังผิดที่"},
    {"name": "The Hermit", "upright": "การถอยไปทบทวน ค้นหาคำตอบจากภายใน",
     "reversed": "โดดเดี่ยวเกินไป ปิดตัวจากโลก"},
    {"name": "Wheel of Fortune", "upright": "วัฏจักร โชคชะตาเปลี่ยนแปลง จังหวะใหม่",
     "reversed": "โชคร้ายชั่วคราว วงจรซ้ำเดิม"},
    {"name": "Justice", "upright": "ความยุติธรรม ผลของการกระทำ ความสมดุล",
     "reversed": "อยุติธรรม หลีกเลี่ยงความรับผิดชอบ"},
    {"name": "The Hanged Man", "upright": "การหยุดมองมุมใหม่ ยอมเสียสละชั่วคราว",
     "reversed": "ติดอยู่กับที่ ไม่ยอมปล่อยวาง"},
    {"name": "Death", "upright": "การสิ้นสุดเพื่อเริ่มใหม่ การเปลี่ยนแปลงครั้งใหญ่",
     "reversed": "ต่อต้านการเปลี่ยนแปลง ค้างคาไม่จบสิ้น"},
    {"name": "Temperance", "upright": "ความสมดุล การผสมผสาน ความอดทนรอ",
     "reversed": "สุดโต่ง ขาดสมดุลในชีวิต"},
    {"name": "The Devil", "upright": "ความยึดติด พันธนาการที่สร้างเอง ความปรารถนาด้านมืด",
     "reversed": "ปลดปล่อยตัวเองจากพันธนาการ ตระหนักรู้"},
    {"name": "The Tower", "upright": "เหตุการณ์ไม่คาดฝัน โครงสร้างเดิมพังทลาย",
     "reversed": "หลีกเลี่ยงวิกฤต แต่หนีปัญหาไม่พ้น"},
    {"name": "The Star", "upright": "ความหวัง การเยียวยา แรงบันดาลใจ",
     "reversed": "หมดหวังชั่วคราว ขาดศรัทธาในตัวเอง"},
    {"name": "The Moon", "upright": "ความคลุมเครือ ความกลัวที่ซ่อนอยู่ สัญชาตญาณ",
     "reversed": "ความสับสนคลี่คลาย ความจริงเริ่มชัด"},
    {"name": "The Sun", "upright": "ความสำเร็จ ความสุขชัดเจน พลังบวก",
     "reversed": "ความสุขที่ล่าช้า มองโลกในแง่ดีเกินจริง"},
    {"name": "Judgement", "upright": "การตื่นรู้ การประเมินตัวเองใหม่ จุดเปลี่ยนสำคัญ",
     "reversed": "ตัดสินตัวเองรุนแรงเกินไป ลังเลใจ"},
    {"name": "The World", "upright": "ความสำเร็จสมบูรณ์ วงจรจบลงอย่างสมบูรณ์",
     "reversed": "ยังไม่จบ ขาดอีกนิดเดียว"},
]

# --- Minor Arcana (raw/tarot/minor-arcana.md) ----------------------------

SUITS = ["Wands", "Cups", "Swords", "Pentacles"]

RANK_THEMES: list[tuple[str, str]] = [
    ("Ace", "จุดเริ่มต้นใหม่ พลังงานบริสุทธิ์ของธาตุนี้"),
    ("Two", "ทางเลือก ความร่วมมือ จุดสมดุลแรก"),
    ("Three", "การเติบโต การขยายตัว ทำงานร่วมกับผู้อื่น"),
    ("Four", "ความมั่นคง โครงสร้าง หรือความนิ่งที่อาจกลายเป็นความจำเจ"),
    ("Five", "ความขัดแย้ง การสูญเสีย บททดสอบ"),
    ("Six", "ความสมดุลกลับคืน ความช่วยเหลือ ความก้าวหน้า"),
    ("Seven", "การประเมินใหม่ ทบทวนกลยุทธ์"),
    ("Eight", "การเคลื่อนไหว ความเร็ว หรือข้อจำกัด"),
    ("Nine", "ใกล้จุดสูงสุด ความอดทนขั้นสุดท้าย"),
    ("Ten", "จุดสมบูรณ์/อิ่มตัวของวัฏจักรนี้ มักนำไปสู่ Ace ใหม่"),
    ("Page", "ผู้เริ่มเรียนรู้ ข่าวสาร พลังงานวัยเยาว์ของธาตุนี้"),
    ("Knight", "การลงมือ/เคลื่อนไหวอย่างแข็งขันตามธาตุนี้"),
    ("Queen", "การเข้าใจและครองพลังงานธาตุนี้อย่างเป็นธรรมชาติ"),
    ("King", "ความเชี่ยวชาญและการควบคุมพลังงานธาตุนี้อย่างสมบูรณ์"),
]

SUIT_ELEMENT = {
    "Wands": ("ไฟ", "พลังงาน แรงบันดาลใจ การลงมือทำ อาชีพ"),
    "Cups": ("น้ำ", "อารมณ์ ความสัมพันธ์ ความรัก จิตใจ"),
    "Swords": ("ลม", "ความคิด การสื่อสาร ความขัดแย้ง สติปัญญา"),
    "Pentacles": ("ดิน", "การเงิน งาน ร่างกาย ความมั่นคงทางวัตถุ"),
}


def _build_minor_arcana() -> list[dict]:
    cards = []
    for suit in SUITS:
        element, domain = SUIT_ELEMENT[suit]
        for rank, theme in RANK_THEMES:
            cards.append({
                "name": f"{rank} of {suit}",
                "upright": f"{theme} — ในบริบทของ{domain} (ธาตุ{element})",
                "reversed": f"พลังงานด้านตรงข้ามหรือค้างของ{theme.split(' ')[0]} — "
                            f"ในบริบทของ{domain} (ธาตุ{element})",
            })
    return cards


MINOR_ARCANA: list[dict] = _build_minor_arcana()

FULL_DECK: list[dict] = (
    [{**c, "arcana": "major"} for c in MAJOR_ARCANA]
    + [{**c, "arcana": "minor"} for c in MINOR_ARCANA]
)

# --- Spreads (raw/tarot/spreads.md) --------------------------------------

SPREADS: dict[str, list[str]] = {
    "single": ["คำตอบ"],
    "three_card": ["สถานการณ์ปัจจุบัน", "อุปสรรค", "คำแนะนำ"],
    "celtic_cross": [
        "สถานการณ์ปัจจุบัน", "อุปสรรค/สิ่งที่ขวาง", "รากฐาน/อดีตไกล",
        "อดีตใกล้", "เป้าหมาย/สิ่งที่เป็นไปได้", "อนาคตใกล้",
        "ตัวตน/มุมมองของผู้ถาม", "อิทธิพลรอบข้าง", "ความหวัง/ความกลัว",
        "ผลลัพธ์สุดท้าย",
    ],
}


def _seed_from(name: str, seed: int | None) -> int:
    if seed is not None:
        return seed
    # Deterministic fallback: hashing the querent's name means a plain-text
    # name-only request is reproducible without the caller having to
    # remember a seed, while still differing across people.
    digest = hashlib.sha256(name.encode("utf-8")).hexdigest()
    return int(digest[:8], 16)


# How strongly a thin element tilts the deck. At 0.0 every card is equally
# likely (a plain shuffle); at 1.0 the tilt is still gentle — the aim is for
# the reading to lean toward the querent's undeveloped element, not to
# stack the deck so hard that the draw stops feeling like a draw.
_TILT_STRENGTH = 0.6

_SUIT_ELEMENT = {suit: element for element, suit in
                 {"fire": "Wands", "earth": "Pentacles",
                  "air": "Swords", "water": "Cups"}.items()}


def _card_element(card: dict) -> str | None:
    if card["arcana"] != "minor":
        return None
    suit = card["name"].rsplit(" of ", 1)[-1]
    return _SUIT_ELEMENT.get(suit)


def _weights_for(element_balance: dict | None) -> list[float]:
    """One weight per card in FULL_DECK.

    A chart that is thin in an element gets those cards boosted, so the
    spread tends to speak to the part of life the chart underplays. Major
    arcana stay at baseline: they are not suit-bound, so no element claims
    them.
    """
    if not element_balance:
        return [1.0] * len(FULL_DECK)

    percent = element_balance.get("percent", {})
    if not percent:
        return [1.0] * len(FULL_DECK)

    even = 100.0 / 4
    weights = []
    for card in FULL_DECK:
        element = _card_element(card)
        if element is None:
            weights.append(1.0)
            continue
        share = percent.get(element, even)
        # deficit is positive when the element is under-represented.
        deficit = (even - share) / even
        weights.append(max(0.15, 1.0 + _TILT_STRENGTH * deficit))
    return weights


def _weighted_sample(rng: random.Random, cards: list[dict],
                     weights: list[float], k: int) -> list[dict]:
    """Sample k distinct cards, honouring weights.

    random.sample() has no weighted form, so draw one at a time and drop
    each pick from the pool — a card can't come up twice in one spread.
    """
    pool = list(cards)
    pool_weights = list(weights)
    picked = []
    for _ in range(k):
        chosen = rng.choices(range(len(pool)), weights=pool_weights, k=1)[0]
        picked.append(pool.pop(chosen))
        pool_weights.pop(chosen)
    return picked


def draw_spread(name: str, spread: str = "three_card", seed: int | None = None,
                element_balance: dict | None = None) -> dict:
    if spread not in SPREADS:
        raise ValueError(f"unknown spread: {spread}")

    positions = SPREADS[spread]
    rng = random.Random(_seed_from(name, seed))
    if element_balance:
        drawn = _weighted_sample(rng, FULL_DECK, _weights_for(element_balance),
                                 len(positions))
    else:
        drawn = rng.sample(FULL_DECK, len(positions))
    orientations = [rng.choice(["upright", "reversed"]) for _ in drawn]

    cards = []
    for position, card, orientation in zip(positions, drawn, orientations):
        cards.append({
            "position": position,
            "card": card["name"],
            "arcana": card["arcana"],
            "orientation": orientation,
            "meaning": card["upright"] if orientation == "upright" else card["reversed"],
        })

    result = {"name": name, "spread": spread, "cards": cards}
    if element_balance:
        result["tilted_toward"] = element_balance.get("lacking")
    return result
