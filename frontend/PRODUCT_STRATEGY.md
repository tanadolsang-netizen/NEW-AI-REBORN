# Astral — Product Strategy

See `MARKET_RESEARCH.md` for the market data behind this plan.

## Unique value proposition

**Astral is the astrology app that takes non-Western traditions and offline
use as seriously as it takes the Western zodiac** — starting with a native
Thai zodiac (ปีนักษัตร) and Buddhist-calendar experience, on a
local-first app that keeps working, and keeps birth data on-device, without
a permanent connection to the cloud.

Competitors localize by translating strings. Astral localizes by building
the underlying astrological system.

## Feature differentiation matrix

| Feature | Co-Star | Nebula | Chani | The Pattern | **Astral** |
|---|---|---|---|---|---|
| Natal / transit / synastry (Western) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Thai zodiac (ปีนักษัตร) + Buddhist year | ❌ | ❌ | ❌ | ❌ | ✅ |
| Thai-language UI | ❌ | ❌ | ❌ | ❌ | ✅ (in progress) |
| Multiple astrological traditions ("branches") | ❌ | Partial (tarot/palmistry bolt-ons) | ❌ | ❌ | ✅ |
| Offline-capable (Capacitor, local-first) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Free tier with real utility | Limited | Limited | Limited | Limited | Target: generous |
| Social / friend charts | ✅ | Partial | ❌ | ✅ | Roadmap |
| Voice/conversational AI reading | ❌ | ❌ | ❌ | ❌ | Roadmap |

## Pricing strategy

- **Free tier:** unlimited natal chart computation, transit-now view, and
  the Thai zodiac widget — the calculation engine is cheap to run
  server-side and expensive UX friction (paywalling core charts) is the
  #1 competitor complaint. Free tier should feel complete, not crippled.
- **Astral+ subscription:** synastry/compatibility reports, saved chart
  history & branches deep-dives, transit notifications, voice AI readings.
  Priced regionally rather than a flat global rate:
  - Thailand/SEA: target ~99–199 THB/month, consistent with reported
    local willingness-to-pay (well under the ~500 THB/month average spend
    figure, to sit as an easy add-on rather than a big-ticket purchase).
  - Global (US/EU): USD 4.99–9.99/month, in line with Co-Star/Chani
    subscription bands.
- **One-time unlocks:** for users who don't want a subscription — e.g. a
  single detailed compatibility report or a printable natal chart PDF.

## Go-to-market

### Thailand (beachhead market)
1. Ship Thai zodiac + Buddhist calendar + Thai-language UI as the
   flagship differentiator (this is the wedge — see implementation below).
2. Partner/content angle: short-form video content translating "your
   ปีนักษัตร this month" style horoscope snippets, distributed on
   TikTok/Instagram — mirrors how Thai horoscope media already works
   (TV/radio daily horoscope segments), just mobile-native.
3. Localize onboarding copy and app store listing in Thai first, English
   second — inverse of the industry default.

### Global expansion (fast-follow)
1. Once the branches system and offline-first architecture are proven in
   the Thai launch, position the same "local tradition, not just
   translated Western astrology" pitch for other underserved markets
   (e.g. Vedic astrology for South Asia) using the same lib/component
   pattern established by `src/lib/thaiZodiac.ts`.
2. Lead with privacy/local-first positioning for Western markets where
   Co-Star/The Pattern already dominate on features — compete on trust
   and offline reliability instead of feature parity.

## Competitive advantages (summary)

- **Offline-first**: Capacitor packaging + on-device computation where
  possible, unlike cloud-dependent competitors.
- **Local language & tradition**: Thai zodiac and Buddhist calendar as a
  first-class system, not a translated afterthought.
- **Privacy**: birth data doesn't need to leave the device for core
  features.
- **Branches knowledge system**: multiple astrological traditions
  side-by-side, where competitors ship one system plus bolt-ons.
- **Voice/AI integration**: roadmap item to match the emerging
  conversational-AI trend competitors are only starting to explore.

## What shipped in this pass

- `src/lib/thaiZodiac.ts` — Thai year-animal (ปีนักษัตร) cycle calculation
  and Buddhist year conversion.
- `src/components/ThaiZodiacWidget.tsx` — birth-year input, animal sign
  result, and an English/Thai language toggle.
- Landing page (`src/app/page.tsx`) section showcasing the widget.

This is a first, working slice of the "native Thai tradition" pillar —
not the full localization effort (a real Thai-language UI toggle across
the whole app, lunar-calendar-accurate cycle boundaries instead of the
CE-year approximation, and horoscope content depth are follow-up work).
