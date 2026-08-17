import math
from datetime import date, time, datetime, timedelta, timezone
from typing import Optional

from src.services.ephemeris import earth, eph, ts, OBLIQUITY

SIGNS = [
    "เมษ(Aries)", "พฤษภ(Taurus)", "เมถุน(Gemini)", "กรกฎ(Cancer)",
    "สิงห์(Leo)", "กันย์(Virgo)", "ตุลย์(Libra)", "พิจิก(Scorpio)",
    "ธนู(Sagittarius)", "มังกร(Capricorn)", "กุมภ์(Aquarius)", "มีน(Pisces)",
]

BODIES = {
    "Sun": "sun",
    "Moon": "moon",
    "Mercury": "mercury",
    "Venus": "venus",
    "Mars": "mars",
    "Jupiter": "jupiter barycenter",
    "Saturn": "saturn barycenter",
    "Uranus": "uranus barycenter",
    "Neptune": "neptune barycenter",
    "Pluto": "pluto barycenter",
}


def compute_chart(
    name: str,
    date,
    time,
    tz_offset_hours: float = 7.0,
    lat: float = 13.8591,
    lon: float = 100.5217,
    system: str = "tropical",
) -> dict:
    dt_local = datetime.combine(date, time)
    dt_utc = dt_local - timedelta(hours=tz_offset_hours)
    dt_utc = dt_utc.replace(tzinfo=timezone.utc)
    bodies = []
    for body_name in BODIES:
        t = ts.from_datetime(dt_utc)
        pos = earth.at(t).observe(eph[BODIES[body_name]])
        lat_ecl, lon_ecl, _ = pos.ecliptic_latlon()
        lon_deg = lon_ecl.degrees % 360
        if system == "sidereal":
            year_frac = dt_utc.year + (dt_utc.timetuple().tm_yday / 365.2425)
            lon_deg = (lon_deg - lahiri_ayanamsa(year_frac)) % 360
        sign, deg = _to_sign(lon_deg)
        bodies.append({
            "body": body_name,
            "sign": sign,
            "degree": round(deg, 4),
            "absolute_deg": round(lon_deg, 4),
        })
    asc = compute_ascendant(dt_utc, lat, lon, system)
    return {
        "name": name,
        "datetime_utc": dt_utc.isoformat() + "Z",
        "system": system,
        "bodies": bodies,
        "ascendant": asc,
    }


def compute_ascendant(dt_utc, lat: float, lon: float, system: str = "tropical") -> dict:
    t = ts.from_datetime(dt_utc)
    gmst = t.gmst
    lst = (gmst + lon / 15.0) % 24.0
    ramc = lst * 15.0
    asc_deg = (_to_xy(ramc, lat, OBLIQUITY) + 180.0) % 360.0
    if system == "sidereal":
        year_frac = dt_utc.year + (dt_utc.timetuple().tm_yday / 365.2425)
        asc_deg = (asc_deg - lahiri_ayanamsa(year_frac)) % 360
    sign, deg = _to_sign(asc_deg)
    return {"body": "ASC", "sign": sign, "degree": round(deg, 4), "absolute_deg": round(asc_deg, 4)}


def _to_sign(longitude_deg: float) -> tuple[str, float]:
    idx = int(longitude_deg // 30) % 12
    return SIGNS[idx], longitude_deg % 30


def _local_to_utc(dt_local, tz_offset_hours: float):
    return dt_local - timedelta(hours=tz_offset_hours)


def _to_xy(ramc: float, lat: float, obliquity_rad: float) -> float:
    ramc_rad = math.radians(ramc)
    lat_rad = math.radians(lat)
    sin_asc = math.cos(obliquity_rad) * math.sin(ramc_rad)
    cos_asc = (
        math.sin(obliquity_rad) * math.sin(lat_rad)
        - math.cos(obliquity_rad) * math.cos(ramc_rad) * math.cos(lat_rad)
    )
    asc_rad = math.atan2(sin_asc, cos_asc)
    return (math.degrees(asc_rad) + 360.0) % 360.0


def lahiri_ayanamsa(year_frac: float) -> float:
    return 23.68 + (year_frac - 1997) * (50.29 / 3600)