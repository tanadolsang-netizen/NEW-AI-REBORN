from datetime import datetime, timezone, timedelta
from typing import Optional

from src.services.ephemeris import earth, eph, ts, OBLIQUITY

from src.services.chart_service import _to_sign


def compute_now(lat: float, lon: float, tz_offset_hours: float = 7.0) -> dict:
    now_utc = datetime.now(timezone.utc)
    t = ts.from_datetime(now_utc)
    bodies = []
    for name, target in {
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
    }.items():
        pos = earth.at(t).observe(eph[target])
        _, lon, _ = pos.ecliptic_latlon()
        lon_deg = lon.degrees % 360
        sign, deg = _to_sign(lon_deg)
        bodies.append({
            "body": name,
            "sign": sign,
            "degree": round(deg, 4),
            "absolute_deg": round(lon_deg, 4),
        })
    return {
        "now_utc": now_utc.isoformat(),
        "tz_offset_hours": tz_offset_hours,
        "lat": lat,
        "lon": lon,
        "bodies": bodies,
    }
